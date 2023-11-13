import React, { useState, useEffect } from 'react';
import { auth } from "../firebase";

function InputDailySpending() {
    const user = auth.currentUser;
    const userEmail = user ? user.email : "";
    useEffect(() => {
        const storedPurchases = JSON.parse(localStorage.getItem(`purchases_${userEmail}`));
        if (storedPurchases && storedPurchases.length > 0) {
            setPurchases(storedPurchases);
            setIsSubmitted(true);
            // Other necessary state updates
        }
    }, []);

    const [showPurchaseFields, setShowPurchaseFields] = useState(false);
    const [purchasedItem, setPurchasedItem] = useState('');
    const [purchaseAmount, setPurchaseAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const [addPurchaseError, setAddPurchaseError] = useState('');
    const [editPurchaseError, setEditPurchaseError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [purchases, setPurchases] = useState([]); // State to store added purchases
    const [message, setMessage] = useState("You did not spend anything today.");
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [isAddMode, setIsAddMode] = useState(true);
    const arePurchasesStored = purchases.length > 0;

    /* dummy category data */
    const selectedCategories = Object.values({category1: "Rent", category2: "Groceries", category3: "Gym"});

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
    const handleSubmit = () => {
        if (purchases.length === 0) {
            setMessage(message);
        } else {
            setMessage("");
            setIsSubmitted(true);
        }
        setShowPurchaseFields(false);
        setPurchases(purchases.slice().reverse());
        setIsAddMode(false);

        localStorage.setItem(`purchases_${userEmail}`, JSON.stringify(purchases));

        // send json obj
        window.alert("Added purchase(s)!");
    };

    /* function handling purchase removal and associated default message */
    const handleRemovePurchase = (index) => {
        const updatedPurchases = [...purchases];
        updatedPurchases.splice(index, 1);
        setPurchases(updatedPurchases);
        if (updatedPurchases.length === 0) {
            setMessage('You did not spend anything today.');
        }
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

    const handleSaveEdit = () => {
        if (editIndex !== null) {
            if (purchasedItem.trim() && purchaseAmount.trim() && selectedCategory) {
                const updatedPurchases = [...purchases];
                updatedPurchases[editIndex] = {
                    item: purchasedItem,
                    amount: purchaseAmount,
                    category: selectedCategory,
                };
                setPurchases(updatedPurchases);
                setEditIndex(null);
                setIsEditing(false);
                setEditPurchaseError('');
            } else {
                setEditPurchaseError('Please fill in all fields.');
            }
        } else {
            setEditPurchaseError('No purchase selected for editing.');
        }
    };

    return (
        <div>
            {purchases.length === 0 && (
                <h2>{message}</h2>
            )}
            <div className="add-user-input">
                <h4>Input Purchase:</h4>
                <button
                    className={'plus-button'}
                    onClick={() => {
                        setShowPurchaseFields(!showPurchaseFields);
                        setIsAddMode(true);
                        setPurchasedItem(''); // Clear previous values when switching to Add mode
                        setPurchaseAmount('');
                        setSelectedCategory('');
                    }}
                >
                    +
                </button>
            </div>

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
                                {selectedCategories.map((category) => (
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
                            onClick={isAddMode ? handleAddPurchase : handleSaveEdit}
                            disabled={amountError !== ''}
                        >
                            {isAddMode ? "Add Purchase" : "Save Edit"}
                        </button>
                    </div>
                )}
            </div>

            <div>
                {isAddMode ? (
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
                            {(isSubmitted && !isAddMode) ? ( // render edit button only when user submits
                                <button className="remove-purchase-button"
                                        onClick={() => handleEditPurchase(index)}>Edit</button>
                            ) : null}
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
                                            {selectedCategories.map((category) => (
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
                                        onClick={handleSaveEdit}
                                        disabled={amountError !== ''}
                                    >
                                        Save Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : null}
            </div>

            <button className="submit-button" onClick={handleSubmit}>
                Submit
            </button>

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
                    arePurchasesStored={arePurchasesStored}
                    setPurchases={setPurchases}
                    showPurchaseFields={showPurchaseFields}
                    // handleSaveEdit={handleSaveEdit}
                />
            }
        </div>
    );
    // }
}

function DisplayDailySpending({ purchases, purchasedItem, setPurchasedItem, purchaseAmount,
                                  handlePurchaseAmountChange, setPurchaseAmount, selectedCategory, setSelectedCategory, selectedCategories,
                              amountError, editPurchaseError, handleRemovePurchase, isSubmitted, mockInputDailyInfo, isAddMode, arePurchasesStored, setPurchases, showPurchaseFields }) {
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

    const handleSaveEdit = (index) => {
        if (index !== null) {
            if (purchasedItem.trim() && purchaseAmount.trim() && selectedCategory) {
                setIsEditing(false);
                setEditIndex(null);

                const updatedPurchases = [...purchases];
                updatedPurchases[editIndex] = {
                    item: purchasedItem,
                    amount: purchaseAmount,
                    category: selectedCategory,
                };
                setPurchases(updatedPurchases);
            } else {
                console.log("please fill in all fields")
            }
        } else {
            console.log("index doesn't exist")
        }
        console.log("handle save is rendering")
    };

    return (
        <div>
            {(!showPurchaseFields && isSubmitted && purchases.length > 0) && (
                <h2>Today's Purchases</h2>
            )}
            {purchases.map((purchase, index) => (
                <div key={index}>
                    <button className="purchase-info-button">
                        <div className={'span'}>
                            {'Purchase: ' + purchase.item}<br />
                            {'Amount: ' + purchase.amount}<br />
                            {'Category: ' + purchase.category}
                        </div>
                    </button>
                    <button className="remove-purchase-button" onClick={() => handleRemovePurchase(index)}>X</button>
                    {(isSubmitted && !isAddMode) ? ( // render edit button only when user submits
                        <button className="remove-purchase-button" onClick={() => handleEditPurchase(index)}>Edit</button>
                    ) : null}
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
                                    {selectedCategories.map((category) => (
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
                                onClick={() => handleSaveEdit(index)}
                                disabled={amountError !== ''}
                            >
                                Save Edit
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default InputDailySpending;