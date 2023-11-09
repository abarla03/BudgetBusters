// /* copy and paste from s1_displaying branch */
// import React, { useState, useEffect } from 'react';
// import { categories } from '../predefinedCategories'
// import { auth } from "../firebase";
// import {post, put, get} from "./ApiClient";
//
// /* landing page of Set Monthly Goal: first page of the Set Monthly Goal form OR a display of the user's previously-inputted goal */
// function SetMonthlyGoal() {
//     console.log("SetMonthlyGoal component is rendering.")
//     /* userEmail is used to as an identifier for if data already exists for a particular user */
//     const user = auth.currentUser;
//     const userEmail = user ? user.email : "";
//     const [isGoalStored, setIsGoalStored] = useState(Boolean(localStorage.getItem(`colorOptions_${userEmail}`)));
//     const [budgetGoalObj, setBudgetGoalObj] = useState({});
//     const [budgetUpdated, setBudgetUpdated] = useState(false); // to re-fetch budget info whenever update happens
//
//     /* obtaining budget goal object from user input */
//     useEffect(() => {
//         function fetchBudgetData() {
//             let data;
//             try {
//                 // Make the GET request to retrieve the budget
//                 data = get(`/getBudget/${userEmail}`)
//             } catch (error) {
//                 console.error("Error creating or fetching budget:", error);
//             }
//             return data;
//         }
//
//         fetchBudgetData().then((response) => {
//             setBudgetGoalObj(response.data);
//         });
//         setBudgetUpdated(false)
//         console.log("budgetGoalObj", budgetGoalObj)
//
//     }, [userEmail, budgetUpdated]);
//
//     /* useState variables needed for filling out setMonthlyGoal() information */
//     const [budget, setBudget] = useState('');
//     const [invalidBudgetError, setInvalidBudgetError] = useState('');
//     const [duplicateCategoryError, setDuplicateCategoryError] = useState('');
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [newCategory, setNewCategory] = useState('');
//     const [createdCategories, setCreatedCategories] = useState([]);
//     const [displayCreatedCategories, setDisplayCreatedCategories] = useState(false);
//     const [showAllCategories, setShowAllCategories] = useState(false);
//     const [formSubmitted, setFormSubmitted] = useState(false);
//     const [allCategories, setAllCategories] = useState([]);
//
//     /* colorOptions is used to remember the colors that the user selected for all their categories
//      * passed as a parameter for ColorCodeCategories() and DisplayMonthlyGoal() functions          */
//     const [colorOptions, setColorOptions] = useState(() => {
//         const storedColorOptions = localStorage.getItem(`colorOptions_${userEmail}`);
//         return storedColorOptions ? JSON.parse(storedColorOptions) : {};
//     });
//
//     // /* need to call get request for actual json object, but this is a temp mock object */
//     // const mockGoalInfo = {
//     //     email: "test@gmail.com",
//     //     monthlyBudget: 500,
//     //     allCategories: ["Rent", "Groceries", "Gym"]
//     // }
//
//     /* function handling non-numeric values in budget goal field */
//     const handleBudgetChange = (event) => {
//         const inputBudget = event.target.value;
//         const numericRegex = /^[0-9]*$/;
//
//         if (numericRegex.test(inputBudget)) {
//             setBudget(inputBudget);
//             setInvalidBudgetError('');
//         } else {
//             setBudget(inputBudget);
//             setInvalidBudgetError('Invalid budget goal. Please provide a numerical input.');
//         }
//     };
//
//     /* function handling user's ability to select multiple categories */
//     const handleCategoryClick = (category) => {
//         if (selectedCategories.includes(category)) {
//             setSelectedCategories(selectedCategories.filter((c) => c !== category));
//             setAllCategories(allCategories.filter((c) => c !== category));
//         } else {
//             setSelectedCategories([...selectedCategories, category]);
//             setAllCategories([...allCategories, category]);
//         }
//     };
//
//     /* function handling user's ability to create new categories */
//     const handleCreateCategory = () => {
//         if (newCategory.trim() !== '') {
//             const newCategoryLowercase = newCategory.toLowerCase();
//
//             if (categories.some(category => category.toLowerCase() === newCategoryLowercase) ||
//                 createdCategories.some(category => category.toLowerCase() === newCategoryLowercase)) {
//                 setDuplicateCategoryError('This category name already exists. Please create another name.');
//             } else {
//                 const updatedCategories = [...createdCategories, newCategory];
//                 setCreatedCategories(updatedCategories);
//                 setAllCategories([...allCategories, newCategory]);
//                 setNewCategory('');
//                 setDuplicateCategoryError('');
//             }
//         }
//     };
//
//     /* function handling user's ability to delete their created categories */
//     const handleRemoveCategory = (categoryToRemove) => {
//         const updatedCategories = createdCategories.filter((c) => c !== categoryToRemove);
//         setCreatedCategories(updatedCategories);
//         setAllCategories(allCategories.filter((c) => c !== categoryToRemove));
//     };
//
//     /* function handling the next button (after user enters their budget & categories) */
//     const handleNext = async () => {
//         // localStorage.setItem(`userData_${userIdentifier}`, JSON.stringify(data));
//         setFormSubmitted(true);
//         setShowAllCategories(true);
//
//         // abstracted json object to send data to backend (Next button)
//         const goalInfo = {
//             email: userEmail,
//             monthlyBudget: 500,
//             allCategories: allCategories,
//             colors: null
//         }
//         console.log(goalInfo);
//         const createBudgetResponse = await post('/createBudget', goalInfo);
//         setBudgetUpdated(true)
//         console.log(createBudgetResponse);
//     };
//
//     // set goal info object equal to get request here (currently mockGoalInfo is substitute for this)
//
//     if (isGoalStored) {
//         return (
//             <DisplayMonthlyGoal
//                 monthlyBudget={budgetGoalObj.monthlyBudget}
//                 allCategories={budgetGoalObj.allCategories}
//                 colorOptions={colorOptions}
//                 budgetGoalObj={budgetGoalObj}
//                 userEmail={userEmail}
//             />
//         );
//     } else {
//         return (
//             formSubmitted ? (
//                     <ColorCodeCategories
//                         allCategories={budgetGoalObj.allCategories}
//                         colorOptions={colorOptions}
//                         setColorOptions={setColorOptions}
//                         userEmail={userEmail}
//                         budgetGoalObj={budgetGoalObj}
//                     />
//                 ) :
//                 <div>
//                     <h3>Set Monthly Budget:</h3>
//                     <div className="input-container">
//                         <input className='user-input-field'
//                                type="text"
//                                placeholder="Enter your budget"
//                                value={budget}
//                                onChange={handleBudgetChange}
//                         />
//                         {invalidBudgetError && <p className="error-message">{invalidBudgetError}</p>}
//                     </div>
//
//                     <h4>Select Categories:</h4>
//                     <div className="category-buttons">
//                         {categories.map((category) => (
//                             <button
//                                 key={category}
//                                 className={`category-button${selectedCategories.includes(category) ? ' selected' : ''}`}
//                                 onClick={() => handleCategoryClick(category)}
//                             >
//                                 {category}
//                             </button>
//                         ))}
//                     </div>
//
//                     <div className="add-user-input">
//                         <h4>Create Categories:</h4>
//                         <button className="plus-button"
//                                 onClick={() => setDisplayCreatedCategories(!displayCreatedCategories)}>+
//                         </button>
//                     </div>
//
//                     <div className="add-field">
//                         {displayCreatedCategories && (
//                             <div>
//                                 <input className='category-field'
//                                        type="text"
//                                        placeholder="Enter a new category"
//                                        value={newCategory}
//                                        onChange={(e) => setNewCategory(e.target.value)}
//                                 />
//                                 <button className='add-button' onClick={handleCreateCategory}>Add</button>
//                             </div>
//                         )}
//                     </div>
//
//                     <div className="category-buttons">
//                         {createdCategories.map((category) => (
//                             <button
//                                 key={category}
//                                 className={`created-category ${category}`}
//                                 onClick={() => handleRemoveCategory(category)}>
//                                 {category}
//                             </button>
//                         ))}
//                     </div>
//
//                     <button
//                         className="submit-button"
//                         type="submit"
//                         onClick={handleNext}
//                         disabled={invalidBudgetError !== ''}>
//                         Next
//                     </button>
//                 </div>
//         )
//     }
// }
//
// /* second page of the Set Monthly Goal form (where the users color-code their categories) */
// function ColorCodeCategories({ allCategories, colorOptions, setColorOptions, budgetGoalObj, userEmail}) {
//     const [submitted, setSubmitted] = useState(false);
//     const [colorCodeError, setColorCodeError] = useState('');
//
//     const hexColorOptions = {
//         Red: '#ff5c70',
//         Orange: '#ffb267',
//         Yellow: '#e9fc87',
//         Green: '#85d67a',
//         Teal: '#47c8a6',
//         Blue: '#5c9dc5',
//         Violet: '#6d5eb0',
//         Purple: '#af7abd',
//         Pink: '#e36498',
//         Grey: '#ccc'
//     };
//
//     /* function handling the color change of categories when hex code is specified */
//     const handleColorChange = (category, color) => {
//         setColorOptions((prevColorOptions) => ({
//             ...prevColorOptions,
//             [category]: color,
//         }));
//     };
//
//     /* function handling the submit button (after the user color codes their categories) */
//     const handleSubmit = async () => {
//         const allCategoriesColored = allCategories.every(
//             (category) => colorOptions[category]
//         );
//
//         if (allCategoriesColored) {
//             setColorCodeError('');
//             setSubmitted(true);
//
//             // collect colors in the order of selectedCategories
//             const selectedColors = allCategories.map((category) => colorOptions[category]);
//
//             // abstracted json object to send data to backend (Submit button)
//             const colorInfo = {
//                 email: userEmail,
//                 selectedCategories: allCategories,
//                 colors: selectedColors
//             }
//
//             console.log(colorInfo);
//             const updateBudgetResponse = await put('/updateBudgetColors', colorInfo);
//             // setBudgetUpdated(true)
//             console.log(updateBudgetResponse);
//
//             localStorage.setItem(`colorOptions_${userEmail}`, JSON.stringify(colorOptions));
//         } else {
//             setColorCodeError('Please enter a color for every category.');
//         }
//         window.alert("This month's budget and spending categories have been created!");
//     };
//
//     // no need for get request here for the colors; colors are stored in localStorage in react
//
//     return (
//         <div>
//             {submitted ? (
//                 <DisplayMonthlyGoal
//                     allCategories={allCategories}
//                     colorOptions={colorOptions}
//                     budgetGoalObj={budgetGoalObj}
//                     userEmail={userEmail}
//                 />
//             ) : (
//                 <>
//                     <h3>Color Code Categories:</h3>
//                     <ul>
//                         {allCategories?.map((category) => (
//                             <li key={category}>
//                                 <div>
//                                     <button className="category-button" id={`button-${category}`} style={{ backgroundColor: colorOptions[category] || '#ccc' }}>
//                                         {category}
//                                     </button>
//                                     <select
//                                         onChange={(e) => handleColorChange(category, e.target.value)}
//                                         value={colorOptions[category] || ''}
//                                     >
//                                         <option value="">Choose Color</option>
//                                         {Object.entries(hexColorOptions).map(([colorName, hexCode]) => (
//                                             <option key={hexCode} value={hexCode}>
//                                                 {colorName}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                     {colorCodeError && <p className="error-message4">{colorCodeError}</p>}
//                     <button
//                         className="submit-button"
//                         type="submit"
//                         onClick={handleSubmit}>
//                         Submit
//                     </button>
//                 </>
//             )}
//         </div>
//     );
// }
//
// /* Display page: rendered after user completes the form AND as a landing page after the user previously inputted their goal */
// function DisplayMonthlyGoal({ allCategories, colorOptions, budgetGoalObj, userEmail }) {
//     const [editableCategories, setEditableCategories] = useState([]);
//     const [duplicateCategoryError2, setDuplicateCategoryError2] = useState('');
//
//     /* obtains the list of modified categories from local storage if it exists and sets equal to categoryNames */
//     const storedModifiedCategories = localStorage.getItem(`modifiedCategories_${userEmail}`);
//     const modifiedCategories = storedModifiedCategories
//         ? JSON.parse(storedModifiedCategories)
//         : {};
//     const [categoryNames, setCategoryNames] = useState(modifiedCategories);
//
//     /* function handling the category editing (ensures that only one category is edited in edit mode) */
//     const handleEditCategory = (category) => {
//         setEditableCategories((prevEditableCategories) => {
//             if (prevEditableCategories.includes(category)) {
//                 return prevEditableCategories.filter((item) => item !== category);
//             } else {
//                 return [...prevEditableCategories, category];
//             }
//         });
//     };
//
//     /* function to save modified category name */
//     const handleSaveCategoryName = (category) => {
//         // put error handling here
//         const modifiedCategoryName = categoryNames[category] || ''; // Get the modified category name.
//
//         // check if the modified category exists in the list of user categories
//         if (Object.values(categoryNames).filter(name => name === modifiedCategoryName).length > 1) {
//             setDuplicateCategoryError2('This category name already exists. Please enter a new name.');
//         } else {
//             setCategoryNames((prevCategoryNames) => ({
//                 ...prevCategoryNames,
//                 [category]: categoryNames[category],
//             }));
//             setEditableCategories((prevEditableCategories) => prevEditableCategories.filter((item) => item !== category));
//             setDuplicateCategoryError2(''); // Clear any previous error message.
//         }
//
//         // creates a full list of category names (whether they have been modified or not)
//         const categoriesAfterEdit = allCategories.reduce((list, category) => {
//             list[category] = categoryNames[category] || category;
//             return list;
//         }, {});
//
//         localStorage.setItem(`modifiedCategories_${userEmail}`, JSON.stringify(categoriesAfterEdit));
//
//         // abstracted json object to send data to backend (Save button)
//         const modifiedCategoryInfo = {
//             email: userEmail,
//             allCategories: categoriesAfterEdit
//         }
//
//         // put post request here (this ensures that when the user closes the app and logs in again, when
//         // SetMonthlyGoal() is called, the get request gets the new set of categories */
//     };
//
//     return (
//         <div>
//             <h8>Your Budget for this Month is  ${budgetGoalObj.monthlyBudget}</h8>
//             <h9>Your Spending Categories are: </h9>
//             <ul>
//                 {/*{((modifiedCategories.length === 0) ? Object.keys(modifiedCategories) : allCategories)?.map((category) => (*/}
//                 {(budgetGoalObj.allCategories)?.map((category) => (
//                     <li key={category}>
//                         <div>
//                             <button className="category-button" id={`button-${category}`}
//                                     style={{backgroundColor: colorOptions[category] || '#ccc'}}>
//                                 {editableCategories.includes(category) ? (
//                                     <input
//                                         type="text"
//                                         value={categoryNames[category] || ''}
//                                         onChange={(e) => setCategoryNames({
//                                             ...categoryNames,
//                                             [category]: e.target.value
//                                         })}
//                                     />
//                                 ) : (
//                                     categoryNames[category] || category
//                                 )}
//                             </button>
//                             {!editableCategories.includes(category) ? (
//                                 <button className="edit-button" onClick={() => handleEditCategory(category)}>
//                                     Edit
//                                 </button>
//                             ) : null}
//                             {editableCategories.includes(category) ? (
//                                 <button className="edit-button" onClick={() => handleSaveCategoryName(category)}>
//                                     Save
//                                 </button>
//                             ) : null}
//                             {duplicateCategoryError2 && <p className="error-message5">{duplicateCategoryError2}</p>}
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
//
// export default SetMonthlyGoal;








// NEW STUFF