/* copy and paste from s1_displaying branch */
import React, { useState, useEffect } from 'react';
import { categories } from '../predefinedCategories'
import { auth } from "../firebase";
import {post, put, get} from "./ApiClient";

/* landing page of Set Monthly Goal: first page of the Set Monthly Goal form OR a display of the user's previously-inputted goal */
function SetMonthlyGoal() {
    console.log("SetMonthlyGoal component is rendering.")
    /* userEmail is used to as an identifier for if data already exists for a particular user */
    const user = auth.currentUser;
    const userEmail = user ? user.email : "";
    const [isGoalStored, setIsGoalStored] = useState(Boolean(localStorage.getItem(`colorOptions_${userEmail}`)));
    // CHANGE 1: add currentMonth useState to track what month it is
    const [currentMonth, setCurrentMonth] = useState('');
    // CHANGE 11: set useState for monitoring whether month needs to reset (may not need this)
    // const [shouldResetGoal, setShouldResetGoal] = useState(false);
    const [budgetGoalObj, setBudgetGoalObj] = useState({});
    const [budgetUpdated, setBudgetUpdated] = useState(false); // to re-fetch budget info whenever update happens

    const resetMonthlyGoal = async () => {
        const budgetReset = {
            email: userEmail
        }
        const resetBudgetResponse = await put('/resetBudget', budgetReset);
    }

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

        // CHANGE 13: FOR THE DEMO: reset after 2 min
        const timer = setTimeout(() => {
            // Reset the goal information after 30 seconds
            setFormSubmitted(false);
            setBudget('');
            setSelectedCategories([]);
            setCreatedCategories([]);
            setBudgetGoalObj({});

            resetMonthlyGoal();
        },  2 * 60 * 1000);

        if (!budgetGoalObj.monthlyBudget) {
            setIsGoalStored(false);
            localStorage.removeItem(`colorOptions_${userEmail}`);
        }

        fetchBudgetData().then((response) => {
            setBudgetGoalObj(response.data);

            // CHANGE 12: REAL THING - check if user has submitted their goal previously, and if date exists
            // if yes, and it's the first day of the new month, reset budgetGoalObj to nothing
            if (response.data && response.data.submissionDate) {
                const currentDate = new Date();

                // before resetting, should we try to save the past month's information?
                if (currentDate.getDate() === 1) {
                    // setShouldResetGoal(true);
                    setIsGoalStored(false);
                    setFormSubmitted(false);
                    setBudget('');
                    setSelectedCategories([]);
                    setCreatedCategories([]);
                    setBudgetGoalObj({});
                    localStorage.removeItem(`colorOptions_${userEmail}`);

                    resetMonthlyGoal();
                }
            }
        });
        setBudgetUpdated(false)
        console.log("budgetGoalObj", budgetGoalObj)

        // CHANGE 2: fetch the current month from the Date library
        const currentDate = new Date();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const currentMonthName = monthNames[currentDate.getMonth()];
        setCurrentMonth(currentMonthName);

        // CHANGE 14: run timeout function at the end of specified time
        return () => clearTimeout(timer);

    }, [userEmail, budgetUpdated]);

    /* useState variables needed for filling out setMonthlyGoal() information */
    const [budget, setBudget] = useState('');
    const [invalidBudgetError, setInvalidBudgetError] = useState('');
    const [duplicateCategoryError, setDuplicateCategoryError] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [createdCategories, setCreatedCategories] = useState([]);
    const [displayCreatedCategories, setDisplayCreatedCategories] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [allCategories, setAllCategories] = useState([]);

    /* colorOptions is used to remember the colors that the user selected for all their categories
     * passed as a parameter for ColorCodeCategories() and DisplayMonthlyGoal() functions          */
    const [colorOptions, setColorOptions] = useState(() => {
        const storedColorOptions = budgetGoalObj.colors ? localStorage.getItem(`colorOptions_${userEmail}`) : null;
        return storedColorOptions ? JSON.parse(storedColorOptions) : {};
    });

    /* function handling non-numeric values in budget goal field */
    const handleBudgetChange = (event) => {
        const inputBudget = event.target.value;
        const numericRegex = /^[0-9]*$/;

        if (numericRegex.test(inputBudget)) {
            setBudget(inputBudget);
            setInvalidBudgetError('');
        } else {
            setBudget(inputBudget);
            setInvalidBudgetError('Invalid budget goal. Please provide a numerical input.');
        }
    };

    /* function handling user's ability to select multiple categories */
    const handleCategoryClick = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter((c) => c !== category));
            setAllCategories(allCategories.filter((c) => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
            setAllCategories([...allCategories, category]);
        }
    };

    /* function handling user's ability to create new categories */
    const handleCreateCategory = () => {
        if (newCategory.trim() !== '') {
            const newCategoryLowercase = newCategory.toLowerCase();

            if (categories.some(category => category.toLowerCase() === newCategoryLowercase) ||
                createdCategories.some(category => category.toLowerCase() === newCategoryLowercase)) {
                setDuplicateCategoryError('This category name already exists. Please create another name.');
            } else {
                const updatedCategories = [...createdCategories, newCategory];
                setCreatedCategories(updatedCategories);
                setAllCategories([...allCategories, newCategory]);
                setNewCategory('');
                setDuplicateCategoryError('');
            }
        }
    };

    /* function handling user's ability to delete their created categories */
    const handleRemoveCategory = (categoryToRemove) => {
        const updatedCategories = createdCategories.filter((c) => c !== categoryToRemove);
        setCreatedCategories(updatedCategories);
        setAllCategories(allCategories.filter((c) => c !== categoryToRemove));
    };

    /* function handling the next button (after user enters their budget & categories) */
    const handleNext = async () => {
        setFormSubmitted(true);
        setShowAllCategories(true);

        // abstracted json object to send data to backend (Next button)
        const goalInfo = {
            email: userEmail,
            monthlyBudget: budget,
            allCategories: allCategories,
            colors: null,
            submissionDate: null
        }
        const createBudgetResponse = await post('/createBudget', goalInfo);
        setBudgetUpdated(true)
    };

    /* return statement depending on whether user inputted their goal beforehand */
    if (isGoalStored) {
        return (
            <DisplayMonthlyGoal
                budgetGoalObj={budgetGoalObj}
                userEmail={userEmail}
                setBudgetUpdated={setBudgetUpdated}
                submissionDate={budgetGoalObj.submissionDate}
            />
        );
    } else {
        return (
            formSubmitted ? (
                    <ColorCodeCategories
                        budgetGoalObj={budgetGoalObj}
                        userEmail={userEmail}
                        setBudgetUpdated={setBudgetUpdated}
                        colorOptions={colorOptions}
                        setColorOptions={setColorOptions}
                    />
                ) :
                <div>
                    {/* CHANGE 3: added current month message */}
                    <h10>{`Fill out the form below to set your goal for ${currentMonth}!`}</h10>
                    <h3>Set Monthly Budget:</h3>
                    <div className="input-container">
                        <input className='user-input-field'
                               type="text"
                               placeholder="Enter your budget"
                               value={budget}
                               onChange={handleBudgetChange}
                        />
                        {invalidBudgetError && <p className="error-message">{invalidBudgetError}</p>}
                    </div>

                    <h4>Select Categories:</h4>
                    <div className="category-buttons">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`category-button${selectedCategories.includes(category) ? ' selected' : ''}`}
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="add-user-input">
                        <h4>Create Categories:</h4>
                        <button className="plus-button"
                                onClick={() => setDisplayCreatedCategories(!displayCreatedCategories)}>+
                        </button>
                    </div>

                    <div className="add-field">
                        {displayCreatedCategories && (
                            <div>
                                <input className='category-field'
                                       type="text"
                                       placeholder="Enter a new category"
                                       value={newCategory}
                                       onChange={(e) => setNewCategory(e.target.value)}
                                />
                                <button className='add-button' onClick={handleCreateCategory}>Add</button>
                            </div>
                        )}
                    </div>

                    <div className="category-buttons">
                        {createdCategories.map((category) => (
                            <button
                                key={category}
                                className={`created-category ${category}`}
                                onClick={() => handleRemoveCategory(category)}>
                                {category}
                            </button>
                        ))}
                    </div>

                    <button
                        className="submit-button"
                        type="submit"
                        onClick={handleNext}
                        disabled={invalidBudgetError !== ''}>
                        Next
                    </button>
                </div>
        )
    }
}

/* second page of the Set Monthly Goal form (where the users color-code their categories) */
function ColorCodeCategories({ budgetGoalObj, userEmail, setBudgetUpdated, colorOptions, setColorOptions}) {
    const [submitted, setSubmitted] = useState(false);
    const [colorCodeError, setColorCodeError] = useState('');
    const allCategories = budgetGoalObj?.allCategories;

    const hexColorOptions = {
        Red: '#ff5c70',
        Orange: '#ffb267',
        Yellow: '#e9fc87',
        Green: '#85d67a',
        Teal: '#47c8a6',
        Blue: '#5c9dc5',
        Violet: '#6d5eb0',
        Purple: '#af7abd',
        Pink: '#e36498',
        Grey: '#ccc'
    };

    /* function handling the color change of categories when hex code is specified */
    const handleColorChange = (category, color) => {
        setColorOptions((prevColorOptions) => ({
            ...prevColorOptions,
            [category]: color,
        }));
    };

    /* function handling the submit button (after the user color codes their categories) */
    const handleSubmit = async () => {
        const allCategoriesColored = allCategories?.every(
            (category) => colorOptions[category]
        );

        if (allCategoriesColored) {
            setColorCodeError('');
            setSubmitted(true);

            // collect colors in the order of selectedCategories
            const selectedColors = allCategories?.map((category) => colorOptions[category]);

            // create a const representing the current date/time
            const submittedDate = new Date();

            // abstracted json object to send data to backend (Submit button)
            const colorInfo = {
                email: userEmail,
                selectedCategories: allCategories,
                colors: selectedColors,
                submissionDate: submittedDate
            }


            const updateBudgetResponse = await put('/updateBudgetColors', colorInfo);
            setBudgetUpdated(true);

            localStorage.setItem(`colorOptions_${userEmail}`, JSON.stringify(colorOptions));
        } else {
            setColorCodeError('Please enter a color for every category.');
        }
        window.alert("This month's budget and spending categories have been created!");
    };

    // no need for get request here for the colors; colors are stored in localStorage in react
    return (
        <div>
            {submitted ? (
                <DisplayMonthlyGoal
                    budgetGoalObj={budgetGoalObj}
                    userEmail={userEmail}
                    setBudgetUpdated={setBudgetUpdated}
                />
            ) : (
                <>
                    <h3>Color Code Categories:</h3>
                    <ul>
                        {allCategories?.map((category) => (
                            <li key={category}>
                                <div>
                                    <button className="category-button" id={`button-${category}`} style={{ backgroundColor: colorOptions[category] || '#ccc' }}>
                                        {category}
                                    </button>
                                    <select
                                        onChange={(e) => handleColorChange(category, e.target.value)}
                                        value={colorOptions[category] || ''}
                                    >
                                        <option value="">Choose Color</option>
                                        {Object.entries(hexColorOptions).map(([colorName, hexCode]) => (
                                            <option key={hexCode} value={hexCode}>
                                                {colorName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {colorCodeError && <p className="error-message4">{colorCodeError}</p>}
                    <button
                        className="submit-button"
                        type="submit"
                        onClick={handleSubmit}>
                        Submit
                    </button>
                </>
            )}
        </div>
    );
}

/* Display page: rendered after user completes the form AND as a landing page after the user previously inputted their goal */
function DisplayMonthlyGoal({ budgetGoalObj, userEmail, setBudgetUpdated }) {
    const [editableCategories, setEditableCategories] = useState([]);
    const [duplicateCategoryError2, setDuplicateCategoryError2] = useState('');
    const allCategories = budgetGoalObj?.allCategories || [];

    /* obtains the list of modified categories from local storage if it exists and sets equal to categoryNames */
    const storedModifiedCategories = localStorage.getItem(`modifiedCategories_${userEmail}`);
    const modifiedCategories = storedModifiedCategories
        ? JSON.parse(storedModifiedCategories)
        : {};
    const [categoryNames, setCategoryNames] = useState(modifiedCategories);
    const categoryIndexMap = {};
    for (let index = 0; index < allCategories?.length; index++) {
        const category = allCategories[index];
        categoryIndexMap[category] = index;
    }

    /* function handling the category editing (ensures that only one category is edited in edit mode) */
    const handleEditCategory = (category) => {
        setEditableCategories((prevEditableCategories) => {
            if (prevEditableCategories.includes(category)) {
                return prevEditableCategories.filter((item) => item !== category);
            } else {
                return [...prevEditableCategories, category];
            }
        });
    };

    /* function to save modified category name */
    const handleSaveCategoryName = async (category) => {
        // put error handling here
        const modifiedCategoryName = categoryNames[category] || ''; // Get the modified category name.

        // check if the modified category exists in the list of user categories
        if (Object.values(categoryNames).filter(name => name === modifiedCategoryName).length > 1) {
            setDuplicateCategoryError2('This category name already exists. Please enter a new name.');
        } else {
            setCategoryNames((prevCategoryNames) => ({
                ...prevCategoryNames,
                [category]: categoryNames[category],
            }));
            setEditableCategories((prevEditableCategories) => prevEditableCategories.filter((item) => item !== category));
            setDuplicateCategoryError2(''); // Clear any previous error message.
        }

        // creates a full list of category names (whether they have been modified or not)
        const categoriesAfterEdit = allCategories.reduce((list, category) => {
            list.push(categoryNames[category] || category);
            return list;
        }, []);

        localStorage.setItem(`modifiedCategories_${userEmail}`, JSON.stringify(categoriesAfterEdit));

        // abstracted json object to send data to backend (Save button)
        const modifiedCategoryInfo = {
            email: userEmail,
            allCategories: categoriesAfterEdit
        }

        console.log(modifiedCategoryInfo);
        const updateBudgetResponse = await put('/updateBudgetCategories', modifiedCategoryInfo);
        setBudgetUpdated(true);
        console.log(updateBudgetResponse);
    };

    const dateObj = new Date(budgetGoalObj.submissionDate);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return (
        <div>
            <h8>Your budget for this month is  ${budgetGoalObj.monthlyBudget}</h8>
            <h9>Your Spending Categories are: </h9>
            <ul>
                {allCategories?.map((category) => (
                    <li key={category}>
                        <div>
                            <button className="category-button" id={`button-${category}`}
                                    style={{backgroundColor: (budgetGoalObj.colors && (budgetGoalObj.colors)[categoryIndexMap[category]]) || '#ccc'}}>

                                {editableCategories.includes(category) ? (
                                    <input
                                        type="text"
                                        value={categoryNames[category] || ''}
                                        onChange={(e) => setCategoryNames({
                                            ...categoryNames,
                                            [category]: e.target.value
                                        })}
                                    />
                                ) : (
                                    categoryNames[category] || category
                                )}
                            </button>
                            {!editableCategories.includes(category) ? (
                                <button className="edit-button" onClick={() => handleEditCategory(category)}>
                                    Edit
                                </button>
                            ) : null}
                            {editableCategories.includes(category) ? (
                                <button
                                    className="edit-button"
                                    onClick={() => handleSaveCategoryName(category)}>
                                    Save
                                </button>
                            ) : null}
                            {duplicateCategoryError2 && <p className="error-message5">{duplicateCategoryError2}</p>}
                        </div>
                    </li>
                ))}
            </ul>
            {(budgetGoalObj.submissionDate) && (
                <h11>Goal submitted on: {formattedDate}</h11>
            )}
        </div>
    );
}

export default SetMonthlyGoal;


// OLD Code 11/27/23

// /* copy and paste from s1_displaying branch */
// import React, { useState, useEffect } from 'react';
// import { categories } from '../predefinedCategories'
// import { auth } from "../firebase";
// import {post, put, get} from "./ApiClient";
// import {all} from "axios";
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
//         setFormSubmitted(true);
//         setShowAllCategories(true);
//
//         // abstracted json object to send data to backend (Next button)
//         const goalInfo = {
//             email: userEmail,
//             monthlyBudget: budget,
//             allCategories: allCategories,
//             colors: null
//         }
//         const createBudgetResponse = await post('/createBudget', goalInfo);
//         setBudgetUpdated(true)
//     };
//
//     /* return statement depending on whether user inputted their goal beforehand */
//     if (isGoalStored) {
//         return (
//             <DisplayMonthlyGoal
//                 budgetGoalObj={budgetGoalObj}
//                 userEmail={userEmail}
//                 setBudgetUpdated={setBudgetUpdated}
//             />
//         );
//     } else {
//         return (
//             formSubmitted ? (
//                     <ColorCodeCategories
//                         budgetGoalObj={budgetGoalObj}
//                         userEmail={userEmail}
//                         setBudgetUpdated={setBudgetUpdated}
//                         colorOptions={colorOptions}
//                         setColorOptions={setColorOptions}
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
// function ColorCodeCategories({ budgetGoalObj, userEmail, setBudgetUpdated, colorOptions, setColorOptions}) {
//     const [submitted, setSubmitted] = useState(false);
//     const [colorCodeError, setColorCodeError] = useState('');
//     const allCategories = budgetGoalObj?.allCategories;
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
//         const allCategoriesColored = allCategories?.every(
//             (category) => colorOptions[category]
//         );
//
//         if (allCategoriesColored) {
//             setColorCodeError('');
//             setSubmitted(true);
//
//             // collect colors in the order of selectedCategories
//             const selectedColors = allCategories?.map((category) => colorOptions[category]);
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
//             setBudgetUpdated(true);
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
//     return (
//         <div>
//             {submitted ? (
//                 <DisplayMonthlyGoal
//                     budgetGoalObj={budgetGoalObj}
//                     userEmail={userEmail}
//                     setBudgetUpdated={setBudgetUpdated}
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
// function DisplayMonthlyGoal({ budgetGoalObj, userEmail, setBudgetUpdated }) {
//     const [editableCategories, setEditableCategories] = useState([]);
//     const [duplicateCategoryError2, setDuplicateCategoryError2] = useState('');
//     const allCategories = budgetGoalObj?.allCategories || [];
//
//     /* obtains the list of modified categories from local storage if it exists and sets equal to categoryNames */
//     const storedModifiedCategories = localStorage.getItem(`modifiedCategories_${userEmail}`);
//     const modifiedCategories = storedModifiedCategories
//         ? JSON.parse(storedModifiedCategories)
//         : {};
//     const [categoryNames, setCategoryNames] = useState(modifiedCategories);
//     const categoryIndexMap = {};
//     for (let index = 0; index < allCategories?.length; index++) {
//         const category = allCategories[index];
//         categoryIndexMap[category] = index;
//     }
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
//     const handleSaveCategoryName = async (category) => {
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
//             list.push(categoryNames[category] || category);
//             return list;
//         }, []);
//
//         localStorage.setItem(`modifiedCategories_${userEmail}`, JSON.stringify(categoriesAfterEdit));
//
//         // abstracted json object to send data to backend (Save button)
//         const modifiedCategoryInfo = {
//             email: userEmail,
//             allCategories: categoriesAfterEdit
//         }
//
//         console.log(modifiedCategoryInfo);
//         const updateBudgetResponse = await put('/updateBudgetCategories', modifiedCategoryInfo);
//         setBudgetUpdated(true);
//         console.log(updateBudgetResponse);
//     };
//
//     return (
//         <div>
//             <h8>Your Budget for this Month is  ${budgetGoalObj.monthlyBudget}</h8>
//             <h9>Your Spending Categories are: </h9>
//             <ul>
//                 {allCategories?.map((category) => (
//                     <li key={category}>
//                         <div>
//                             <button className="category-button" id={`button-${category}`}
//                                 style={{backgroundColor: (budgetGoalObj.colors && (budgetGoalObj.colors)[categoryIndexMap[category]]) || '#ccc'}}>
//
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
//                                 <button
//                                     className="edit-button"
//                                     onClick={() => handleSaveCategoryName(category)}>
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