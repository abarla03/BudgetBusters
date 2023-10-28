import React, { useState } from 'react';

function InputDailySpending() {
    const [showPurchaseFields, setShowPurchaseFields] = useState(false);
    const [purchasedItem, setPurchasedItem] = useState('');
    const [purchaseAmount, setPurchaseAmount] = useState('');
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [purchases, setPurchases] = useState([]); // State to store added purchases
    const [message, setMessage] = useState("You did not spend anything today.");

    const selectedCategories = Object.values({ category1: "hello", category2: "world" });

    const handlePurchaseAmountChange = (event) => {
        const inputAmount = event.target.value;
        const numericRegex = /^[0-9]*$/;

        if (numericRegex.test(inputAmount)) {
            setPurchaseAmount(inputAmount);
            setError('');
        } else {
            setPurchaseAmount(inputAmount);
            setError('Invalid purchase amount. Please provide a numerical input.');
        }
    };

    const handleInputChange = (e) => {
        setPurchasedItem(e.target.value);
    };

    const handleAddPurchase = () => {
        if (purchasedItem.trim() && purchaseAmount.trim() && selectedCategory) {
            const newPurchase = {
                item: purchasedItem,
                amount: purchaseAmount,
                category: selectedCategory,
                selected: true, // Initially selected
            };
            setPurchases([...purchases, newPurchase]);
            setPurchasedItem('');
            setPurchaseAmount('');
            setSelectedCategory('');
            setError('');
            // setShowPurchaseFields(false);
        } else {
            setError('Please fill in all fields.');
        }
    };

    const handleDeselectPurchase = (index) => {
        const updatedPurchases = [...purchases];
        updatedPurchases[index].selected = !updatedPurchases[index].selected;
        setPurchases(updatedPurchases);
    };

    const handleSubmit = () => {
        setMessage("Today's purchases:");
        setShowPurchaseFields(false);

        // You can handle any submission logic here, such as sending the data to the server.
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
                    <div>
                        <p>Purchase:</p>
                        <input className={'purchase-item'}
                               type="text"
                               value={purchasedItem}
                               onChange={handleInputChange}
                               placeholder="Enter your purchased item"
                        />
                        <p>Amount:</p>
                        <input className={'amount-input'}
                               type="text"
                               value={purchaseAmount}
                               onChange={handlePurchaseAmountChange}
                               placeholder="Item Amount"
                        />
                        <p>Select Category:</p>
                        <select
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
                        {error && <p className="error-message">{error}</p>}
                        <button className="add-button" onClick={handleAddPurchase}>
                            Add
                        </button>
                    </div>
                )}
            </div>

            <div>
                {purchases.map((purchase, index) => (
                    <div key={index}>
                        <button
                            onClick={() => handleDeselectPurchase(index)}
                            className={`deselect-button ${purchase.selected ? 'selected' : ''}`}
                        >
                            {purchase.item} - {purchase.amount} - {purchase.category}
                        </button>
                    </div>
                ))}
            </div>

            <button className="submit-button" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    );
}

export default InputDailySpending;

// import React, { useState } from 'react';
//
// function InputDailySpending() {
//     const [showPurchaseFields, setShowPurchaseFields] = useState(false);
//     const [purchasedItem, setPurchasedItem] = useState('');
//     const [purchaseAmount, setPurchaseAmount] = useState('');
//     const [error, setError] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const [purchases, setPurchases] = useState([]); // State to store added purchases
//
//     const selectedCategories = Object.values({ category1: "hello", category2: "world" });
//
//     const handlePurchaseAmountChange = (event) => {
//         const inputAmount = event.target.value;
//         const numericRegex = /^[0-9]*$/;
//
//         if (numericRegex.test(inputAmount)) {
//             setPurchaseAmount(inputAmount);
//             setError('');
//         } else {
//             setPurchaseAmount(inputAmount);
//             setError('Invalid purchase amount. Please provide a numerical input.');
//         }
//     };
//
//     const handleInputChange = (e) => {
//         setPurchasedItem(e.target.value);
//     };
//
//     const handleAddPurchase = () => {
//         if (purchasedItem.trim() && purchaseAmount.trim() && selectedCategory) {
//             const newPurchase = {
//                 item: purchasedItem,
//                 amount: purchaseAmount,
//                 category: selectedCategory,
//             };
//             setPurchases([...purchases, newPurchase]);
//             setPurchasedItem('');
//             setPurchaseAmount('');
//             setSelectedCategory('');
//             setError('');
//             setShowPurchaseFields(false);
//         } else {
//             setError('Please fill in all fields.');
//         }
//     };
//
//     return (
//         <div>
//             <h2>You did not spend anything today.</h2>
//             <div className="add-user-input">
//                 <h4>Input Purchase:</h4>
//                 <button className={'plus-button'} onClick={() => setShowPurchaseFields(!showPurchaseFields)}>+</button>
//             </div>
//
//             <div className="add-field">
//                 {showPurchaseFields && (
//                     <div>
//                         <p>Purchase:</p>
//                         <input className={'purchase-item'}
//                                type="text"
//                                value={purchasedItem}
//                                onChange={handleInputChange}
//                                placeholder="Enter your purchased item"
//                         />
//                         <p>Amount:</p>
//                         <input className={'amount-input'}
//                                type="text"
//                                value={purchaseAmount}
//                                onChange={handlePurchaseAmountChange}
//                                placeholder="Item Amount"
//                         />
//                         <p>Select Category:</p>
//                         <select
//                             value={selectedCategory}
//                             onChange={(e) => setSelectedCategory(e.target.value)}
//                         >
//                             <option value="">Select a category</option>
//                             {selectedCategories.map((category) => (
//                                 <option key={category} value={category}>
//                                     {category}
//                                 </option>
//                             ))}
//                         </select>
//                         {error && <p className="error-message">{error}</p>}
//                         <button className="add-button" onClick={handleAddPurchase}>
//                             Add
//                         </button>
//                     </div>
//                 )}
//             </div>
//
//             <div>
//                 {purchases.map((purchase, index) => (
//                     <div key={index}>
//                         <p>Purchase: {purchase.item}</p>
//                         <p>Amount: {purchase.amount}</p>
//                         <p>Category: {purchase.category}</p>
//                     </div>
//                 ))}
//             </div>
//
//             <button className="submit-button">
//                 Submit
//             </button>
//         </div>
//     );
// }
//
// export default InputDailySpending;



// import React, { useState } from 'react';
// import SetMonthlyGoal from "./SetMonthlyGoal";
// function InputDailySpending() {
//     const [showPurchaseFields, setShowPurchaseFields] = useState(false);
//     const [purchasedItem, setPurchasedItem] = useState('');
//     const [purchaseAmount, setPurchaseAmount] = useState('');
//     const [error, setError] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState(''); // New state for selected category
//     // const cats = Object.values(SetMonthlyGoal.selectedCategories);
//
//     const selectedCategories = Object.values({category1: "hello", category2: "world"});
//
//     const handlePurchaseAmountChange = (event) => {
//         const inputAmount = event.target.value;
//         const numericRegex = /^[0-9]*$/;
//
//         if (numericRegex.test(inputAmount)) {
//             setPurchaseAmount(inputAmount);
//             setError('');
//         } else {
//             setPurchaseAmount(inputAmount);
//             setError('Invalid purchase amount. Please provide a numerical input.');
//         }
//     };
//
//     const handleInputChange = (e) => {
//         setPurchasedItem(e.target.value);
//     };
//
//     return (
//         <div>
//             <h2>You did not spend anything today.</h2>
//             <div className="add-user-input">
//                 <h4>Input Purchase:</h4>
//                 <button className={'plus-button'} onClick={() => setShowPurchaseFields(!showPurchaseFields)}>+</button>
//             </div>
//
//             <div className="add-field">
//                 {showPurchaseFields && (
//                     <div>
//                         <p>Purchase:</p>
//                         <input className={'purchase-item'}
//                             type="text"
//                             value={purchasedItem}
//                             onChange={handleInputChange}
//                             placeholder="Enter your purchased item"
//                         />
//                         <p>Amount:</p>
//                         <input className={'amount-input'}
//                                type="text"
//                                value={purchaseAmount}
//                                onChange={handlePurchaseAmountChange}
//                                placeholder="Item Amount"
//                         />
//                         {error && <p className="error-message">{error}</p>}
//                         <p>Select Category:</p>
//                         <select
//                             value={selectedCategory}
//                             onChange={(e) => setSelectedCategory(e.target.value)}
//                         >
//                             <option value="">Select a category</option>
//                             {selectedCategories.map((category) => (
//                                 <option key={category} value={category}>
//                                     {category}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
// export default InputDailySpending;
//
