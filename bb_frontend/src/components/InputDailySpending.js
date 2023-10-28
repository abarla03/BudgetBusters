import React, { useState } from 'react';

function InputDailySpending() {
    const [showPurchaseFields, setShowPurchaseFields] = useState(false);
    const [purchasedItem, setPurchasedItem] = useState('');
    const [purchaseAmount, setPurchaseAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const [inputPurchaseError, setInputPurchaseError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [purchases, setPurchases] = useState([]); // State to store added purchases
    const [message, setMessage] = useState("You did not spend anything today.");

    /* dummy category data */
    const selectedCategories = Object.values({ category1: "hello", category2: "world" });

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
            setInputPurchaseError('');
        } else {
            setInputPurchaseError('Please fill in all fields.');
        }
    };

    /* function handling the submit button for finalizing user purchases and displaying them in reverse order */
    const handleSubmit = () => {
        if (purchases.length === 0) {
            setMessage(message);
        } else {
            setMessage("Today's purchases:");
        }
        setShowPurchaseFields(false);
        setPurchases(purchases.slice().reverse());

        // send json object
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

    return (
        <div>
            <h2>{message}</h2>
            <div className="add-user-input">
                <h4>Input Purchase:</h4>
                <button className={'plus-button'} onClick={() => setShowPurchaseFields(!showPurchaseFields)}>+</button>
            </div>

            <div className="add-field">
                {showPurchaseFields && (
                    <div className={'input-purchase'}>
                        <h5>Purchase:</h5>
                        <input className={'purchase-item'}
                               type="text"
                               value={purchasedItem}
                               onChange={(e) => setPurchasedItem(e.target.value)}
                               placeholder="Enter your purchased item"
                        />
                        <div>
                            <h6>Amount:</h6>
                            <input className={'amount-input'}
                                   type="text"
                                   value={purchaseAmount}
                                   onChange={handlePurchaseAmountChange}
                                   placeholder="Item Amount"
                            />
                        </div>
                        <div className="category-container">
                            <h7>Select Category:</h7>
                            <select className='category-dropdown'
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
                        {inputPurchaseError && <p className="error-message3">{inputPurchaseError}</p>}
                        <button
                            className="add-button2"
                            onClick={handleAddPurchase}
                            disabled={amountError !== ''}>
                            Add Purchase
                        </button>
                    </div>
                )}
            </div>

            <div>
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
                    </div>
                ))}
            </div>

            {purchases.length > 0 && (
                <button
                    className="submit-button"
                    onClick={handleSubmit}>
                    Submit
                </button>
            )}
        </div>
    );
}

export default InputDailySpending;