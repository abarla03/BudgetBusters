import React, { useState, useEffect } from 'react';
import { auth } from "../firebase";
import {post, put, get, del} from "./ApiClient";

function InputDailySpending() {
    const user = auth.currentUser;
    const userEmail = user ? user.email : "";
    useEffect(() => {
        const storedPurchases = JSON.parse(localStorage.getItem(`purchases_${userEmail}`));
        if (storedPurchases && storedPurchases.length > 0) {
            setPurchases(storedPurchases);
            setIsSubmitted(true);
        }
    }, []);

    const [inputDailyObj, setInputDailyObj] = useState({});
    const [inputDailyUpdated, setInputDailyUpdated] = useState(false); // to re-fetch input info whenever update happens

    const [budgetGoalObj, setBudgetGoalObj] = useState({});
    const [budgetUpdated, setBudgetUpdated] = useState(false); // to re-fetch budget info whenever update happens

    /* obtaining input daily spending object from user input */
    useEffect(() => {
        function fetchInputDailyData() {
            let data;
            try {
                // Make the GET request to retrieve the budget
                data = get(`/getPurchase/${userEmail}`)
            } catch (error) {
                console.error("Error creating or fetching purchase(s):", error);
            }
            return data;
        }

        fetchInputDailyData().then((response) => {
            setInputDailyObj(response.data);
        });
        setInputDailyUpdated(false);

    }, [userEmail, inputDailyUpdated]);


    /* obtaining budget goal object from user input */
    useEffect(() => {
        function fetchBudgetData() {
            let data;
            try {
                // Make the GET request to retrieve the budget
                data = get(`/getBudget/${userEmail}`)
            } catch (error) {
                console.error("Error creating or fetching budget:", error);
            }
            return data;
        }

        fetchBudgetData().then((response) => {
            setBudgetGoalObj(response.data);
        });
        setBudgetUpdated(false)

    }, [userEmail, budgetUpdated]);

    const [showPurchaseFields, setShowPurchaseFields] = useState(false);
    const [purchasedItem, setPurchasedItem] = useState('');
    const [purchaseAmount, setPurchaseAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const [addPurchaseError, setAddPurchaseError] = useState('');
    const [editPurchaseError, setEditPurchaseError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [purchases, setPurchases] = useState([]); // State to store added purchases
    const [noSpendingMessage, setNoSpendingMessage] = useState("You did not spend anything today.");
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [isAddMode, setIsAddMode] = useState(true);
    const [messageFlag, setMessageFlag] = useState(false);
    const [categoryCountFlag, setCategoryCountFlag] = useState(false);
    const arePurchasesStored = inputDailyObj?.numPurchases > 0;

    /* category data from setMonthlyGoal Page*/
    const selectedCategories = budgetGoalObj.allCategories;

    /* function handling reset purchases on backend */
    const resetPurchases = async () => {
        const inputDailyReset = {
            email: userEmail,
            currentDayTotal: inputDailyObj?.currentDayTotal ? inputDailyObj?.currentDayTotal : 0,
            dayCategoryCount: inputDailyObj?.dayCategoryCount ? inputDailyObj?.dayCategoryCount : []
        }
        const resetPurchases = await put('/resetPurchases', inputDailyReset);
    }

    /* resets purchases at the end of day with timer (NOTE: 1 day = 3 min) */
    useEffect(() => {
        setCategoryCountFlag(false);
        const timer = setTimeout(() => {
            resetPurchases();
            setNoSpendingMessage("You did not spend anything today.")
            setIsSubmitted(false);
            setMessageFlag(true);
            setCategoryCountFlag(true);
            localStorage.removeItem(`purchases_${userEmail}`)

        }, 0.5 * 60 * 1000);

        // clear the timer when the component unmounts or when purchases are cleared manually
        return () => clearTimeout(timer);
    }, [userEmail, purchases]);

    /* function handling non-numeric values in purchase amount field */
    const handlePurchaseAmountChange = (event) => {
        const inputAmount = event.target.value;
        const numericRegex = /^[0-9]*$/;

        if (numericRegex.test(inputAmount)) {
            setPurchaseAmount(inputAmount);
            setAmountError('');
        } else {
            setPurchaseAmount(inputAmount);
            setAmountError('Invalid purchase amount. Please provide a numerical input.');
        }
    };

    /* function handling purchase adding - making sure every field is entered */
    const handleAddPurchase = () => {
        if (purchasedItem.trim() && purchaseAmount.trim() && selectedCategory) {
            const newPurchase = {
                item: purchasedItem,
                amount: purchaseAmount,
                category: selectedCategory,
                selected: true,
            };
            setPurchases([...purchases, newPurchase]);
            setPurchasedItem('');
            setPurchaseAmount('');
            setSelectedCategory('');

            setAddPurchaseError('');
            setEditIndex(null);
            setIsEditing(false);
        } else {
            setAddPurchaseError('Please fill in all fields.');
        }
    };

    /* function handling the submit button for finalizing user purchases and displaying them in reverse order */
    const handleSubmit = async () => {
        if (purchases.length === 0) {
            setNoSpendingMessage(noSpendingMessage);
        } else {
            setNoSpendingMessage("");
            setIsSubmitted(true);
        }
        setShowPurchaseFields(false);
        setPurchases(purchases);
        setIsAddMode(false);

        localStorage.setItem(`purchases_${userEmail}`, JSON.stringify(purchases));
        const currentDayTotal = purchases.reduce((total, purchase) => {
            return total + parseInt(purchase.amount);
        }, 0);

        // create dictionary mapping each category to its respective spending amount
        const categoryCountDict = selectedCategories.reduce((dict, category, currentIndex) => {
            dict[category] = 0;
            setCategoryCountFlag(false);
            console.log("dict: ", dict)
            return dict;
        }, {});

        // iterate through purchases and add total corresponding to the purchases' categories
        for (const purchase of purchases) {
            categoryCountDict[purchase.category] += parseInt(purchase.amount);
            console.log("categoryCountDict: ", categoryCountDict)

        }
        const dayCategoryCount = Object.values(categoryCountDict);
        const totalDailySpending = inputDailyObj.totalDailySpending || [];
        const cumulativeDailySpending = inputDailyObj.cumulativeDailySpending || [];
        const categoryCount = inputDailyObj.categoryCount || [];
        // send json obj
        const userPurchaseInfo = {
            email: userEmail,
            numPurchases: purchases.length,
            purchases: purchases.map((purchase) => ({
                purchaseName: purchase.item,
                purchaseAmount: purchase.amount,
                purchaseCategory: purchase.category,
            })),
            currentDayTotal: currentDayTotal,
            totalDailySpending: totalDailySpending,
            cumulativeDailySpending: cumulativeDailySpending,
            categoryCount: categoryCount,
            dayCategoryCount: dayCategoryCount
        }

        const createInputDailyResponse = await post('/createPurchase', userPurchaseInfo);
        setInputDailyUpdated(true);
        window.alert("Saved purchase(s)!");
    };

    /* function handling purchase removal and associated default noSpendingMessage */
    const handleRemovePurchase = async (index) => {
        const updatedPurchases = purchases.filter((_, i) => i !== index);
        setPurchases(updatedPurchases);
        if (updatedPurchases.length === 0) {
            setNoSpendingMessage('You did not spend anything today.');
        }

        const currentDayTotal = purchases.reduce((total, purchase) => {
            return total + parseInt(purchase.amount);
        }, 0);

        const purchaseToRemove = {
            email: userEmail,
            purchase: purchases[index],
            currentDayTotal: currentDayTotal
        }

        const delPurchaseResponse = await del(`/deletePurchase/${userEmail}/${index}/${currentDayTotal}`, purchaseToRemove);
        setInputDailyUpdated(true);
        window.alert("Click Submit to confirm your deleted purchase!");
    };

    /* function to edit input spending */
    const handleEditPurchase = (index) => {
        const purchaseToEdit = purchases[index];
        setPurchasedItem(purchaseToEdit.item);
        setPurchaseAmount(purchaseToEdit.amount);
        setSelectedCategory(purchaseToEdit.category);
        setEditIndex(index);
        setIsEditing(true);
        setEditPurchaseError('');
    };

    return (
        <div>
            {/* if inputDailyObj doesn't exist OR contains no purchases, display no spending message.
                else, display total spending amount */}
            {!inputDailyObj ? (
                <h2>{noSpendingMessage}</h2>
                ) : (inputDailyObj?.purchases === null && inputDailyObj?.numPurchases === null) ? (
                    <h2>{noSpendingMessage}</h2>
                ) : (messageFlag) ? (
                    <h2>{noSpendingMessage}</h2>
                ) :
                    <h2>{"Total Spending for Today: $" + inputDailyObj?.currentDayTotal}</h2>
            }

            {/* displays empty purchase fields when plus button is clicked (removes fields when clicked again) */}
            <div className="add-user-input">
                <h4>Input Purchase:</h4>
                <button
                    className={'plus-button'}
                    onClick={() => {
                        setShowPurchaseFields(!showPurchaseFields);
                        setIsAddMode(true);
                        setPurchasedItem(''); // clear previous values when switching to add mode
                        setPurchaseAmount('');
                        setSelectedCategory('');
                    }}>
                    +
                </button>
            </div>

            {/* displays all empty purchase fields, handles respective input errors, and accounts for both add purchase/save edit cases */}
            <div className="add-field">
                {showPurchaseFields && (
                    <div className={'input-purchase'}>
                        <h5>Purchase:</h5>
                        <input
                            className={'purchase-item'}
                            type="text"
                            value={purchasedItem}
                            onChange={(e) => setPurchasedItem(e.target.value)}
                            placeholder="Enter your purchased item"
                        />
                        <div>
                            <h6>Amount:</h6>
                            <input
                                className={'amount-input'}
                                type="text"
                                value={purchaseAmount}
                                onChange={handlePurchaseAmountChange}
                                placeholder="Item Amount"
                            />
                        </div>
                        <div className="category-container">
                            <h7>Select Category:</h7>
                            <select
                                className='category-dropdown'
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Select a category</option>
                                {selectedCategories?.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {amountError && <p className="error-message2">{amountError}</p>}
                        {addPurchaseError && <p className="error-message3">{addPurchaseError}</p>}
                        <button
                            className="add-button2"
                            onClick={handleAddPurchase}
                            disabled={amountError !== ''}
                        >
                            {isAddMode ? "Add Purchase" : "Save Edit2"}
                        </button>
                    </div>
                )}
            </div>

            {/* displays purchase button when user adds each purchase, allowing them to see their inputs before they submit*/}
            <div>
                {isAddMode && (
                    purchases.map((purchase, index) => (
                        <div key={index}>
                            {(!arePurchasesStored) && (
                            <div>
                                <button className="purchase-info-button">
                                    <div className={'span'}>
                                        {'Purchase: ' + purchase.item}<br />
                                        {'Amount: ' + purchase.amount}<br />
                                        {'Category: ' + purchase.category}
                                    </div>
                                </button>
                                <button className="remove-purchase-button" onClick={() => handleRemovePurchase(index)}>X</button>
                            </div>
                            )}
                            {(isSubmitted && !isAddMode) && ( // render edit button only when user submits
                                <button className="remove-purchase-button"
                                        onClick={() => handleEditPurchase(index)}>Edit</button>
                            )}
                            {isEditing && editIndex === index && (
                                <div className="edit-purchase"> {/* prepopulate input fields when editing */}
                                    <h5>Purchase:</h5>
                                    <input
                                        className={'purchase-item'}
                                        type="text"
                                        value={purchasedItem}
                                        onChange={(e) => setPurchasedItem(e.target.value)}
                                        placeholder="Enter your purchased item"
                                    />
                                    <div>
                                        <h6>Amount:</h6>
                                        <input
                                            className={'amount-input'}
                                            type="text"
                                            value={purchaseAmount}
                                            onChange={handlePurchaseAmountChange}
                                            placeholder="Item Amount"
                                        />
                                    </div>
                                    <div className="category-container">
                                        <h7>Select Category:</h7>
                                        <select
                                            className='category-dropdown'
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                        >
                                            <option value="">Select a category</option>
                                            {selectedCategories?.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {amountError && <p className="error-message7">{amountError}</p>}
                                    {editPurchaseError && <p className="error-message8">{editPurchaseError}</p>}
                                    <button
                                        className="add-button2"
                                        disabled={amountError !== ''}
                                    >
                                        Save Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <button className="submit-button" onClick={handleSubmit}>
                Submit
            </button>

            {/* NOTE: new arePurchasesStored is the boolean for if the OBJ exists */}
            {((purchases.length > 0 && !isAddMode) || (arePurchasesStored)) &&
                <DisplayDailySpending
                    purchases={purchases}
                    purchasedItem={purchasedItem}
                    setPurchasedItem={setPurchasedItem}
                    purchaseAmount={purchaseAmount}
                    handlePurchaseAmountChange={handlePurchaseAmountChange}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedCategories={selectedCategories}
                    amountError={amountError}
                    editPurchaseError={editPurchaseError}
                    handleRemovePurchase={handleRemovePurchase}
                    isSubmitted={isSubmitted}
                    setPurchaseAmount={setPurchaseAmount}
                    isAddMode={false}
                    setPurchases={setPurchases}
                    showPurchaseFields={showPurchaseFields}
                    userEmail={userEmail}
                    setInputDailyUpdated={setInputDailyUpdated}
                    inputDailyObj={inputDailyObj}
                />
            }
        </div>
    );
}

function DisplayDailySpending({ purchases, purchasedItem, setPurchasedItem, purchaseAmount,
                                  handlePurchaseAmountChange, setPurchaseAmount, selectedCategory, setSelectedCategory,
                                  selectedCategories, amountError, editPurchaseError, handleRemovePurchase, isSubmitted,
                                  isAddMode, setPurchases, showPurchaseFields, userEmail, setInputDailyUpdated, inputDailyObj}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const handleEditPurchase = (index) => {
        setEditIndex(index);
        setIsEditing(true);

        const selectedPurchase = purchases[index];
        setPurchasedItem(selectedPurchase.item);
        setPurchaseAmount(selectedPurchase.amount);
        setSelectedCategory(selectedPurchase.category);
    };

    const handleSaveUpdate = async (index) => {
        if (index !== null) {
            if (purchasedItem.trim() && purchaseAmount.trim() && selectedCategory) {
                setIsEditing(false);
                setEditIndex(null);

                const updatedPurchases = [...purchases];
                updatedPurchases[index] = {
                    item: purchasedItem,
                    amount: purchaseAmount,
                    category: selectedCategory,
                };
                setPurchases(updatedPurchases);

                const currentDayTotal = updatedPurchases.reduce((total, purchase) => {
                    return total + parseInt(purchase.amount);
                }, 0);

                // create dictionary mapping each category to its respective spending amount
                const categoryCountDict = selectedCategories.reduce((dict, category) => {
                    dict[category] = 0;
                    return dict;
                }, {});

                // iterate through purchases and add total corresponding to the purchases' categories
                for (const purchase of purchases) {
                    categoryCountDict[purchase.category] += parseInt(purchase.amount, 10) || 0;
                }
                const dayCategoryCount = Object.values(categoryCountDict);

                const totalDailySpending = inputDailyObj.totalDailySpending;
                const cumulativeDailySpending = inputDailyObj.cumulativeDailySpending;
                const categoryCount = inputDailyObj.categoryCount;

                const updatedPurchaseInfo = {
                    email: userEmail,
                    numPurchases: purchases.length,
                    purchases: updatedPurchases.map((purchase) => ({
                        purchaseName: purchase.item,
                        purchaseAmount: purchase.amount,
                        purchaseCategory: purchase.category,
                    })),
                    currentDayTotal: currentDayTotal,
                    totalDailySpending: totalDailySpending,
                    cumulativeDailySpending: cumulativeDailySpending,
                    categoryCount: categoryCount,
                    dayCategoryCount: dayCategoryCount
                }
                const updatedInputDailyResponse = await put('/updatePurchase', updatedPurchaseInfo);
                setInputDailyUpdated(true);
            } else {
                console.log("Please fill in all fields.")
            }
        } else {
            console.log("Index doesn't exist.")
        }
        console.log("Handle save is rendering.")
    };

    return (
        <div>
            {/* when user has submitted their purchases and are not adding a new purchase, message displays */}
            {(isSubmitted && !showPurchaseFields && (inputDailyObj ? inputDailyObj.purchases : purchases)?.length > 0) && (
                <h2>Today's Purchases</h2>
            )}
            {/* when inputDailyObj exists and user is not in add mode, display all purchases from the obj */}
            {(isSubmitted && !isAddMode && inputDailyObj.purchases?.map((purchase, index) => (
                <div key={index}>
                    <button className="purchase-info-button">
                        <div className={'span'}>
                            {'Purchase: ' + purchase.purchaseName}<br />
                            {'Amount: ' + purchase.purchaseAmount}<br />
                            {'Category: ' + purchase.purchaseCategory}
                        </div>
                    </button>
                    <button className="remove-purchase-button" onClick={() => handleRemovePurchase(index)}>X</button>
                    {(isSubmitted && !isAddMode) && ( // render edit button only when user submits
                        <button className="remove-purchase-button" onClick={() => handleEditPurchase(index)}>Edit</button>
                    )}
                    {isEditing && editIndex === index && (
                        <div className="edit-purchase"> {/* prepopulate input fields when editing */}
                            <h5>Purchase:</h5>
                            <input
                                className={'purchase-item'}
                                type="text"
                                value={purchasedItem}
                                onChange={(e) => setPurchasedItem(e.target.value)}
                                placeholder="Enter your purchased item"
                            />
                            <div>
                                <h6>Amount:</h6>
                                <input
                                    className={'amount-input'}
                                    type="text"
                                    value={purchaseAmount}
                                    onChange={handlePurchaseAmountChange}
                                    placeholder="Item Amount"
                                />
                            </div>
                            <div className="category-container">
                                <h7>Select Category:</h7>
                                <select
                                    className='category-dropdown'
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">Select a category</option>
                                    {selectedCategories?.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {amountError && <p className="error-message7">{amountError}</p>}
                            {editPurchaseError && <p className="error-message8">{editPurchaseError}</p>}
                            <button
                                className="add-button2"
                                onClick={() => handleSaveUpdate(index)}
                                disabled={amountError !== ''}
                            >
                                Save Edit
                            </button>
                        </div>
                    )}
                </div>
            )))}
        </div>
    )
}

export default InputDailySpending;