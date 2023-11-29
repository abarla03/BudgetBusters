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

    // const [isSubmitted, setIsSubmitted] = useState(false);
    // const [purchases, setPurchases] = useState([]);

    /* function handling the reset of inputDailyObj after timer ends */
    // const resetPurchases = async () => {
    //     const inputDailyReset = {
    //         email: userEmail
    //     }
    //     const resetPurchases = await put('/resetPurchases', inputDailyReset);
    // }

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

        // // timer for completing the "day" (NOTE: 1 day = 3 min)
        // const timer = setTimeout(() => {
        //     resetPurchases();
        //
        // },  0.5 * 60 * 1000);

        fetchInputDailyData().then((response) => {
            setInputDailyObj(response.data);
        });
        setInputDailyUpdated(false);

        // run the timer function
        // return () => clearTimeout(timer);
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
    const arePurchasesStored = inputDailyObj?.numPurchases > 0;

    /* category data from setMonthlyGoal Page*/
    const selectedCategories = budgetGoalObj.allCategories;


    //USE EFFECT --------------------------------------------------------------
    const resetPurchases = async () => {
        const inputDailyReset = {
            email: userEmail,
            currentDayTotal: inputDailyObj.currentDayTotal
        }
        const resetPurchases = await put('/resetPurchases', inputDailyReset);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            resetPurchases();
            setNoSpendingMessage("You did not spend anything today.")
            setIsSubmitted(false);
            localStorage.removeItem(`purchases_${userEmail}`)

        }, 0.5 * 60 * 1000);

        // clear the timer when the component unmounts or when purchases are cleared manually
        return () => clearTimeout(timer);
    }, [userEmail, purchases]);
    //USE EFFECT --------------------------------------------------------------

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
        const categoryCountDict = selectedCategories.reduce((dict, category) => {
            dict[category] = 0;
            return dict;
        }, {});

        // iterate through purchases and add total corresponding to the purchases' categories
        for (const purchase of purchases) {
            categoryCountDict[purchase.category] += parseInt(purchase.amount, 10) || 0;
        }
        const categoryCount = Object.values(categoryCountDict);
        const totalDailySpending = inputDailyObj.totalDailySpending || [];
        const cumulativeDailySpending = inputDailyObj.cumulativeDailySpending || [];

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
            categoryCount: categoryCount
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
            {((!inputDailyObj) || (inputDailyObj?.numPurchases === null)) ? (
                <h2>{noSpendingMessage}</h2>
            ) : <h2>{"Total Spending for Today: $" + inputDailyObj.currentDayTotal}</h2>}

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
                            //     <div>
                            //         <p>TEST TEST</p>
                            //     </div>
                            // )}
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
                const categoryCount = Object.values(categoryCountDict);

                const updatedPurchaseInfo = {
                    email: userEmail,
                    numPurchases: purchases.length,
                    purchases: updatedPurchases.map((purchase) => ({
                        purchaseName: purchase.item,
                        purchaseAmount: purchase.amount,
                        purchaseCategory: purchase.category,
                    })),
                    currentDayTotal: currentDayTotal,
                    totalDailySpending: [900],
                    cumulativeDailySpending: [1000],
                    categoryCount: categoryCount
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
            {/*{!isAddMode && inputDailyObj && inputDailyObj.purchases?.map((purchase, index) => (*/}
            {(isSubmitted && !showPurchaseFields && inputDailyObj.purchases?.map((purchase, index) => (
                // <div>
                // <p>INSIDE DISPLAY </p>
                // </div>
                <div key={index}>
                    <p>INSIDE DISPLAY </p>
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


// S3_PREV_US2 code (with time resetting implemented)
// import React, { useState, useEffect } from 'react';
// import { auth } from "../firebase";
//
// function InputDailySpending() {
//     const user = auth.currentUser;
//     const userEmail = user ? user.email : "";
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     useEffect(() => {
//         const storedPurchases = JSON.parse(localStorage.getItem(`purchases_${userEmail}`));
//         if (storedPurchases && storedPurchases.length > 0) {
//             setPurchases(storedPurchases);
//             // setIsSubmitted(true);
//             // Other necessary state updates
//         }
//
//         // REAL IMPLEMENTATION OF MIDNIGHT RESET
//         // set up an interval to check and reset purchases at midnight
//     //     const midnightReset = () => {
//     //         const now = new Date();
//     //         const midnight = new Date(now);
//     //         midnight.setHours(24, 0, 0, 0); // Set to midnight of the current day
//     //
//     //         // calculate the time until midnight
//     //         const timeUntilMidnight = midnight - now;
//     //
//     //         // reset purchases at midnight
//     //         setTimeout(() => {
//     //             setPurchases([]);
//     //             setNoSpendingMessage("You did not spend anything today.");
//     //             //set inputDailyObj to nothing as well?
//     //         }, timeUntilMidnight);
//     //     };
//     //
//     //     // check and reset purchases at midnight every day
//     //     const intervalId = setInterval(midnightReset, 1000 * 60 * 60);
//     //
//     //     // cleanup interval when the component is unmounted
//     //     return () => clearInterval(intervalId);
//     // }, [userEmail]); // dependency array ensures the effect runs when the userEmail changes
//
//
//         //TESTING IMPLEMENTATION OF RESETTING 30 SEC AFTER SUBMISSION
//         // set up a timeout to reset purchases after 2 minutes
//         const resetTimeout = setTimeout(() => {
//             setPurchases([]);
//             setNoSpendingMessage("You did not spend anything today.");
//         }, 0.5 * 60 * 1000); // 30 sec
//
//         // Cleanup timeout when the component is unmounted or purchases are submitted
//         return () => clearTimeout(resetTimeout);
//     }, [userEmail, isSubmitted]);
//
//
//     const [showPurchaseFields, setShowPurchaseFields] = useState(false);
//     const [purchasedItem, setPurchasedItem] = useState('');
//     const [purchaseAmount, setPurchaseAmount] = useState('');
//     const [amountError, setAmountError] = useState('');
//     const [addPurchaseError, setAddPurchaseError] = useState('');
//     const [editPurchaseError, setEditPurchaseError] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const [purchases, setPurchases] = useState([]); // State to store added purchases
//     const [noSpendingMessage, setNoSpendingMessage] = useState("You did not spend anything today.");
//     const [isEditing, setIsEditing] = useState(false);
//     const [editIndex, setEditIndex] = useState(null);
//     const [isAddMode, setIsAddMode] = useState(true);
//     const arePurchasesStored = purchases.length > 0;
//
//     /* dummy category data */
//     const selectedCategories = Object.values({category1: "Rent", category2: "Groceries", category3: "Gym"});
//
//     /* function handling non-numeric values in purchase amount field */
//     const handlePurchaseAmountChange = (event) => {
//         const inputAmount = event.target.value;
//         const numericRegex = /^[0-9]*$/;
//
//         if (numericRegex.test(inputAmount)) {
//             setPurchaseAmount(inputAmount);
//             setAmountError('');
//         } else {
//             setPurchaseAmount(inputAmount);
//             setAmountError('Invalid purchase amount. Please provide a numerical input.');
//         }
//     };
//
//     /* function handling purchase adding - making sure every field is entered */
//     const handleAddPurchase = () => {
//         if (purchasedItem.trim() && purchaseAmount.trim() && selectedCategory) {
//             const newPurchase = {
//                 item: purchasedItem,
//                 amount: purchaseAmount,
//                 category: selectedCategory,
//                 selected: true,
//             };
//             setPurchases([...purchases, newPurchase]);
//             setPurchasedItem('');
//             setPurchaseAmount('');
//             setSelectedCategory('');
//
//             setAddPurchaseError('');
//             setEditIndex(null);
//             setIsEditing(false);
//         } else {
//             setAddPurchaseError('Please fill in all fields.');
//         }
//     };
//
//     /* function handling the submit button for finalizing user purchases and displaying them in reverse order */
//     const handleSubmit = () => {
//         if (purchases.length === 0) {
//             setNoSpendingMessage(noSpendingMessage);
//         } else {
//             setNoSpendingMessage("");
//             setIsSubmitted(true);
//         }
//         setShowPurchaseFields(false);
//         setPurchases(purchases.slice().reverse());
//         setIsAddMode(false);
//
//         localStorage.setItem(`purchases_${userEmail}`, JSON.stringify(purchases));
//
//         // send json obj
//         window.alert("Added purchase(s)!");
//     };
//
//     /* function handling purchase removal and associated default noSpendingMessage */
//     const handleRemovePurchase = (index) => {
//         const updatedPurchases = [...purchases];
//         updatedPurchases.splice(index, 1);
//         setPurchases(updatedPurchases);
//         if (updatedPurchases.length === 0) {
//             setNoSpendingMessage('You did not spend anything today.');
//         }
//     };
//
//     /* function to edit input spending */
//     const handleEditPurchase = (index) => {
//         const purchaseToEdit = purchases[index];
//         setPurchasedItem(purchaseToEdit.item);
//         setPurchaseAmount(purchaseToEdit.amount);
//         setSelectedCategory(purchaseToEdit.category);
//         setEditIndex(index);
//         setIsEditing(true);
//         setEditPurchaseError('');
//     };
//
//     const handleSaveEdit = () => {
//         if (editIndex !== null) {
//             if (purchasedItem.trim() && purchaseAmount.trim() && selectedCategory) {
//                 const updatedPurchases = [...purchases];
//                 updatedPurchases[editIndex] = {
//                     item: purchasedItem,
//                     amount: purchaseAmount,
//                     category: selectedCategory,
//                 };
//                 setPurchases(updatedPurchases);
//                 setEditIndex(null);
//                 setIsEditing(false);
//                 setEditPurchaseError('');
//             } else {
//                 setEditPurchaseError('Please fill in all fields.');
//             }
//         } else {
//             setEditPurchaseError('No purchase selected for editing.');
//         }
//     };
//
//     return (
//         <div>
//             {purchases.length === 0 && (
//                 <h2>{noSpendingMessage}</h2>
//             )}
//             <div className="add-user-input">
//                 <h4>Input Purchase:</h4>
//                 <button
//                     className={'plus-button'}
//                     onClick={() => {
//                         setShowPurchaseFields(!showPurchaseFields);
//                         setIsAddMode(true);
//                         setPurchasedItem(''); // Clear previous values when switching to Add mode
//                         setPurchaseAmount('');
//                         setSelectedCategory('');
//                     }}
//                 >
//                     +
//                 </button>
//             </div>
//
//             <div className="add-field">
//                 {showPurchaseFields && (
//                     <div className={'input-purchase'}>
//                         <h5>Purchase:</h5>
//                         <input
//                             className={'purchase-item'}
//                             type="text"
//                             value={purchasedItem}
//                             onChange={(e) => setPurchasedItem(e.target.value)}
//                             placeholder="Enter your purchased item"
//                         />
//                         <div>
//                             <h6>Amount:</h6>
//                             <input
//                                 className={'amount-input'}
//                                 type="text"
//                                 value={purchaseAmount}
//                                 onChange={handlePurchaseAmountChange}
//                                 placeholder="Item Amount"
//                             />
//                         </div>
//                         <div className="category-container">
//                             <h7>Select Category:</h7>
//                             <select
//                                 className='category-dropdown'
//                                 value={selectedCategory}
//                                 onChange={(e) => setSelectedCategory(e.target.value)}
//                             >
//                                 <option value="">Select a category</option>
//                                 {selectedCategories.map((category) => (
//                                     <option key={category} value={category}>
//                                         {category}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         {amountError && <p className="error-noSpendingMessage2">{amountError}</p>}
//                         {addPurchaseError && <p className="error-noSpendingMessage3">{addPurchaseError}</p>}
//                         <button
//                             className="add-button2"
//                             onClick={isAddMode ? handleAddPurchase : handleSaveEdit}
//                             disabled={amountError !== ''}
//                         >
//                             {isAddMode ? "Add Purchase" : "Save Edit"}
//                         </button>
//                     </div>
//                 )}
//             </div>
//
//             <div>
//                 {isAddMode ? (
//                     purchases.map((purchase, index) => (
//                         <div key={index}>
//                             {(!arePurchasesStored) && (
//                             <div>
//                                 <button className="purchase-info-button">
//                                     <div className={'span'}>
//                                         {'Purchase: ' + purchase.item}<br />
//                                         {'Amount: ' + purchase.amount}<br />
//                                         {'Category: ' + purchase.category}
//                                     </div>
//                                 </button>
//                                 <button className="remove-purchase-button" onClick={() => handleRemovePurchase(index)}>X</button>
//                             </div>
//                             )}
//                             {(isSubmitted && !isAddMode) ? ( // render edit button only when user submits
//                                 <button className="remove-purchase-button"
//                                         onClick={() => handleEditPurchase(index)}>Edit</button>
//                             ) : null}
//                             {isEditing && editIndex === index && (
//                                 <div className="edit-purchase"> {/* prepopulate input fields when editing */}
//                                     <h5>Purchase:</h5>
//                                     <input
//                                         className={'purchase-item'}
//                                         type="text"
//                                         value={purchasedItem}
//                                         onChange={(e) => setPurchasedItem(e.target.value)}
//                                         placeholder="Enter your purchased item"
//                                     />
//                                     <div>
//                                         <h6>Amount:</h6>
//                                         <input
//                                             className={'amount-input'}
//                                             type="text"
//                                             value={purchaseAmount}
//                                             onChange={handlePurchaseAmountChange}
//                                             placeholder="Item Amount"
//                                         />
//                                     </div>
//                                     <div className="category-container">
//                                         <h7>Select Category:</h7>
//                                         <select
//                                             className='category-dropdown'
//                                             value={selectedCategory}
//                                             onChange={(e) => setSelectedCategory(e.target.value)}
//                                         >
//                                             <option value="">Select a category</option>
//                                             {selectedCategories.map((category) => (
//                                                 <option key={category} value={category}>
//                                                     {category}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                     {amountError && <p className="error-noSpendingMessage7">{amountError}</p>}
//                                     {editPurchaseError && <p className="error-noSpendingMessage8">{editPurchaseError}</p>}
//                                     <button
//                                         className="add-button2"
//                                         onClick={handleSaveEdit}
//                                         disabled={amountError !== ''}
//                                     >
//                                         Save Edit
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     ))
//                 ) : null}
//             </div>
//
//             <button className="submit-button" onClick={handleSubmit}>
//                 Submit
//             </button>
//
//             {((purchases.length > 0 && !isAddMode) || (arePurchasesStored)) &&
//                 <DisplayDailySpending
//                     purchases={purchases}
//                     purchasedItem={purchasedItem}
//                     setPurchasedItem={setPurchasedItem}
//                     purchaseAmount={purchaseAmount}
//                     handlePurchaseAmountChange={handlePurchaseAmountChange}
//                     selectedCategory={selectedCategory}
//                     setSelectedCategory={setSelectedCategory}
//                     selectedCategories={selectedCategories}
//                     amountError={amountError}
//                     editPurchaseError={editPurchaseError}
//                     handleRemovePurchase={handleRemovePurchase}
//                     isSubmitted={isSubmitted}
//                     setPurchaseAmount={setPurchaseAmount}
//                     isAddMode={false}
//                     arePurchasesStored={arePurchasesStored}
//                     setPurchases={setPurchases}
//                     showPurchaseFields={showPurchaseFields}
//                     // handleSaveEdit={handleSaveEdit}
//                 />
//             }
//         </div>
//     );
//     // }
// }
//
// function DisplayDailySpending({ purchases, purchasedItem, setPurchasedItem, purchaseAmount,
//                                   handlePurchaseAmountChange, setPurchaseAmount, selectedCategory, setSelectedCategory, selectedCategories,
//                               amountError, editPurchaseError, handleRemovePurchase, isSubmitted, mockInputDailyInfo, isAddMode, arePurchasesStored, setPurchases, showPurchaseFields }) {
//     const [isEditing, setIsEditing] = useState(false);
//     const [editIndex, setEditIndex] = useState(null);
//
//     const handleEditPurchase = (index) => {
//         setEditIndex(index);
//         setIsEditing(true);
//
//         const selectedPurchase = purchases[index];
//         setPurchasedItem(selectedPurchase.item);
//         setPurchaseAmount(selectedPurchase.amount);
//         setSelectedCategory(selectedPurchase.category);
//     };
//
//     const handleSaveEdit = (index) => {
//         if (index !== null) {
//             if (purchasedItem.trim() && purchaseAmount.trim() && selectedCategory) {
//                 setIsEditing(false);
//                 setEditIndex(null);
//
//                 const updatedPurchases = [...purchases];
//                 updatedPurchases[editIndex] = {
//                     item: purchasedItem,
//                     amount: purchaseAmount,
//                     category: selectedCategory,
//                 };
//                 setPurchases(updatedPurchases);
//             } else {
//                 console.log("please fill in all fields")
//             }
//         } else {
//             console.log("index doesn't exist")
//         }
//         console.log("handle save is rendering")
//     };
//
//     return (
//         <div>
//             {(!showPurchaseFields && isSubmitted && purchases.length > 0) && (
//                 <h2>Today's Purchases</h2>
//             )}
//             {purchases.map((purchase, index) => (
//                 <div key={index}>
//                     <button className="purchase-info-button">
//                         <div className={'span'}>
//                             {'Purchase: ' + purchase.item}<br />
//                             {'Amount: ' + purchase.amount}<br />
//                             {'Category: ' + purchase.category}
//                         </div>
//                     </button>
//                     <button className="remove-purchase-button" onClick={() => handleRemovePurchase(index)}>X</button>
//                     {(isSubmitted && !isAddMode) ? ( // render edit button only when user submits
//                         <button className="remove-purchase-button" onClick={() => handleEditPurchase(index)}>Edit</button>
//                     ) : null}
//                     {isEditing && editIndex === index && (
//                         <div className="edit-purchase"> {/* prepopulate input fields when editing */}
//                             <h5>Purchase:</h5>
//                             <input
//                                 className={'purchase-item'}
//                                 type="text"
//                                 value={purchasedItem}
//                                 onChange={(e) => setPurchasedItem(e.target.value)}
//                                 placeholder="Enter your purchased item"
//                             />
//                             <div>
//                                 <h6>Amount:</h6>
//                                 <input
//                                     className={'amount-input'}
//                                     type="text"
//                                     value={purchaseAmount}
//                                     onChange={handlePurchaseAmountChange}
//                                     placeholder="Item Amount"
//                                 />
//                             </div>
//                             <div className="category-container">
//                                 <h7>Select Category:</h7>
//                                 <select
//                                     className='category-dropdown'
//                                     value={selectedCategory}
//                                     onChange={(e) => setSelectedCategory(e.target.value)}
//                                 >
//                                     <option value="">Select a category</option>
//                                     {selectedCategories.map((category) => (
//                                         <option key={category} value={category}>
//                                             {category}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                             {amountError && <p className="error-noSpendingMessage7">{amountError}</p>}
//                             {editPurchaseError && <p className="error-noSpendingMessage8">{editPurchaseError}</p>}
//                             <button
//                                 className="add-button2"
//                                 onClick={() => handleSaveEdit(index)}
//                                 disabled={amountError !== ''}
//                             >
//                                 Save Edit
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             ))}
//         </div>
//     )
// }
//
// export default InputDailySpending;