import React, { useState, useEffect } from 'react';
import { categories } from '../predefinedCategories'
import Login from './auth/Login'
import { auth } from "../firebase";
// import SelectedCategoriesPage from './SelectedCategoriesPage'
function SetMonthlyGoal() {
    console.log("SetMonthlyGoal component is rendering.")

    // try parsing user data
    // const userData = JSON.parse(localStorage.getItem('userData')) || {};

    const [budget, setBudget] = useState('');
    const [error, setError] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [createdCategories, setCreatedCategories] = useState([]);
    const [displayCreatedCategories, setDisplayCreatedCategories] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [allCategories, setAllCategories] = useState([]);
    const [isGoalSubmitted, setIsGoalSubmitted] = useState(false);
    // for now, proceed with mock json object with static vals
    const mockGoalInfo = {
        email: "test@gmail.com",
        monthlyBudget: 500,
        allCategories: ["Rent", "Gym"]
    }

    // Get the user's unique identifier (e.g., email) after they log in
    const user = auth.currentUser;
    let firebaseEmail = "";
    if (user) {
        firebaseEmail = user.email;
        // console.log(firebaseEmail);
    }
    const userIdentifier = firebaseEmail;
    const isDataStored = Boolean(localStorage.getItem(userIdentifier));

    // Initialize user data from localStorage or an empty object
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem(userIdentifier)) || {});

    // useEffect to set initial state with user data when available
    useEffect(() => {
        if (userData) {
            setBudget(userData.monthlyBudget || '');
            setSelectedCategories(userData.selectedCategories || []);
            setCreatedCategories(userData.createdCategories || []);
            setAllCategories(userData.allCategories || []);
        }
    }, [userData]);

    /* function handling non-numeric values in budget goal field */
    const handleBudgetChange = (event) => {
        const inputBudget = event.target.value;
        const numericRegex = /^[0-9]*$/;

        if (numericRegex.test(inputBudget)) {
            setBudget(inputBudget);
            setError('');
        } else {
            setBudget(inputBudget);
            setError('Invalid budget goal. Please provide a numerical input.');
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
            const updatedCategories = [...createdCategories, newCategory];
            setCreatedCategories(updatedCategories);
            setAllCategories([...allCategories, newCategory]);
            setNewCategory('');
        }
    };

    /* function handling user's ability to delete their created categories */
    const handleRemoveCategory = (categoryToRemove) => {
        const updatedCategories = createdCategories.filter((c) => c !== categoryToRemove);
        setCreatedCategories(updatedCategories);
        setAllCategories(allCategories.filter((c) => c !== categoryToRemove));
    };

    const handleSubmit = () => {
        setFormSubmitted(true);
        setShowAllCategories(true);

        // abstracted json object to send data to backend (Next button)
        const goalInfo = {
            // email: Login.email,
            monthlyBudget: budget,
            allCategories: allCategories
        }

        const updatedUserData = {
            ...userData,
            monthlyBudget: budget,
            selectedCategories: allCategories,
            createdCategories: createdCategories,
            allCategories: allCategories,
        };

        localStorage.setItem(userIdentifier, JSON.stringify(updatedUserData));
        // setIsGoalSubmitted(true);
    };

    // get request here

    return (
          <div>
            {/*{formSubmitted ? (*/}
            {/*{isDataStored ? <DisplayMonthlyGoal mockGoalInfo={mockGoalInfo} isGoalSubmitted={isDataStored} /> : null}*/}
            {(isDataStored) || (formSubmitted && selectedCategories.length > 0) ? (
                // <DisplayMonthlyGoal mockGoalInfo={mockGoalInfo} isGoalSubmitted={isDataStored} />
                <SelectedCategoriesPage selectedCategories={allCategories} />
            ) : (
                <>
                    <h3>Set Monthly Budget:</h3>
                    <div className="input-container">
                        <input className='user-input-field'
                               type="text"
                               placeholder="Enter your budget"
                               value={budget}
                               onChange={handleBudgetChange}
                        />
                        {error && <p className="error-message">{error}</p>}
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
                        <button className="plus-button" onClick={() => setDisplayCreatedCategories(!displayCreatedCategories)}>+</button>
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
                        onClick={handleSubmit}
                        disabled={error !== ''}
                    >
                        Next
                    </button>
                </>
            )}
        </div>
    );
}

/* set monthly goal pt.2: function handling color coding categories */
function SelectedCategoriesPage({ selectedCategories }) {
    const [colorOptions, setColorOptions] = useState({});
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    // const [editableCategories, setEditableCategories] = useState([]);
    const [categoryNames, setCategoryNames] = useState({});
    const [monthlyGoalDisplay, setMonthlyGoalDisplay] = useState('');
    const [allCategoriesDisplay, setAllCategoriesDisplay] = useState('');
    const [isGoalSubmitted, setIsGoalSubmitted] = useState(false);
    const mockGoalInfo = {
        email: "test@gmail.com",
        monthlyBudget: 500,
        allCategories: ["Rent", "Gym"]
    }

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

    useEffect(() => {
        // Load previously saved data from localStorage
        const savedData = JSON.parse(localStorage.getItem('selectedCategoriesData')) || {};

        if (Object.keys(savedData).length > 0) {
            setMonthlyGoalDisplay(savedData.monthlyGoalDisplay || '');
            setCategoryNames(savedData.categoryNames || {});
            setColorOptions(savedData.colorOptions || {});

            // Convert selectedCategories and colorOptions to text format
            const categoriesText = selectedCategories.map((category) => {
                const color = colorOptions[category] || 'DefaultColor';
                return `${category}: ${color}`;
            });

            setAllCategoriesDisplay(categoriesText.join(', '));
        }
    }, [selectedCategories]);

    /* function handling the color change of categories when hex code is specified */
    const handleColorChange = (category, color) => {
        setColorOptions((prevColorOptions) => ({
            ...prevColorOptions,
            [category]: color,
        }));
    };

    /* function handling submit button and if all categories are colored */
    const handleSubmit = () => {
        const allCategoriesColored = selectedCategories.every(
            (category) => colorOptions[category]
        );

        if (allCategoriesColored) {
            setError('');
            setSubmitted(true);

            // collect colors in the order of selectedCategories
            const selectedColors = selectedCategories.map((category) => colorOptions[category]);

            // abstracted json object to send data to backend (Submit button)
            const colorInfo = {
                // email: Login.email,
                selectedCategories: selectedCategories,
                colors: selectedColors
            }

            const dataToSave = {
                monthlyGoalDisplay,
                categoryNames,
                colorOptions,
            };

            localStorage.setItem('selectedCategoriesData', JSON.stringify(dataToSave));
            // setIsGoalSubmitted(true);
        } else {
            setError('Please enter a color for every category.');
        }
        setIsGoalSubmitted(true);
    };

    /* function handling the category editing (ensures that only one category is edited in edit mode) */
    // const handleEditCategory = (category) => {
    //     setEditableCategories((prevEditableCategories) => {
    //         if (prevEditableCategories.includes(category)) {
    //             return prevEditableCategories.filter((item) => item !== category);
    //         } else {
    //             return [...prevEditableCategories, category];
    //         }
    //     });
    // };
    //
    // /* function to save modified category name */
    // const handleSaveCategoryName = (category) => {
    //     setCategoryNames((prevCategoryNames) => ({
    //         ...prevCategoryNames,
    //         [category]: categoryNames[category],
    //     }));
    //     setEditableCategories((prevEditableCategories) => prevEditableCategories.filter((item) => item !== category));
    //
    //     // creates a full list of category names (whether they have been modified or not)
    //     const categoriesAfterEdit = selectedCategories.reduce((list, category) => {
    //         list[category] = categoryNames[category] || category;
    //         return list;
    //     }, {});
    //
    //     // abstracted json object to send data to backend (Save button)
    //     const modifiedCategoryInfo = {
    //         // email: Login.email,
    //         allCategories: categoriesAfterEdit
    //     }
    // };

//     return (
//         <div>
//             {isGoalSubmitted ? <h3>Monthly Goal:</h3> : null}
//             {isGoalSubmitted ? <p>{mockGoalInfo.monthlyBudget}</p> : null}
//             {isGoalSubmitted ? null :
//                 <button
//                     className="submit-button"
//                     type="submit"
//                     onClick={handleSubmit}
//                 >
//                 Submit
//                 </button> }
//             <h3>Selected Categories:</h3>
//             {error && <p style={{ color: 'red'}}>{error}</p>}
//             <ul>
//                 {selectedCategories.map((category) => (
//                     <li key={category}>
//                         <div>
//                             <button className="category-button"
//                                     id={`button-${category}`}
//                                     style={{ backgroundColor: colorOptions[category] || '#ccc' }}
//                             >
//                                 {submitted && editableCategories.includes(category) ? (
//                                     <input
//                                         type="text"
//                                         value={categoryNames[category] || ''}
//                                         onChange={(e) => setCategoryNames({ ...categoryNames, [category]: e.target.value })}
//                                     />
//                                 ) : (
//                                     categoryNames[category] || category
//                                 )}
//                             </button>
//                             {submitted && !editableCategories.includes(category) ? (
//                                 <button
//                                     className="edit-button"
//                                     onClick={() => handleEditCategory(category)}
//                                 >
//                                     Edit
//                                 </button>
//                             ) : null}
//                             {editableCategories.includes(category) ? (
//                                 <button
//                                     className="edit-button"
//                                     onClick={() => handleSaveCategoryName(category)}
//                                 >
//                                     Save
//                                 </button>
//                             ) : null}
//                             {submitted ? null : (
//                                 <select
//                                     onChange={(e) => handleColorChange(category, e.target.value)}
//                                     value={colorOptions[category] || category}
//                                 >
//                                     <option value="">Choose Color</option>
//                                     {Object.entries(hexColorOptions).map(([colorName, hexCode]) => (
//                                         <option key={hexCode} value={hexCode}>
//                                             {colorName}
//                                         </option>
//                                     ))}
//                                 </select>
//                             )}
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//             {/*<button*/}
//             {/*    className="back-button"*/}
//             {/*    type="submit"*/}
//             {/*>*/}
//             {/*    Back*/}
//             {/*</button>*/}
//             {/*<button*/}
//             {/*    className="submit-button"*/}
//             {/*    type="submit"*/}
//             {/*    onClick={handleSubmit}*/}
//             {/*>*/}
//             {/*    Submit*/}
//             {/*</button>*/}
//         </div>
//     );
// }
    return (
    //     <div>
    //         {isGoalSubmitted ? (
    //             <DisplayMonthlyGoal
    //                 selectedCategories={selectedCategories}
    //                 colorOptions={colorOptions}
    //                 hexColorOptions={hexColorOptions}
    //                 error={error}
    //                 editableCategories={editableCategories}
    //                 categoryNames={categoryNames}
    //                 handleEditCategory={handleEditCategory}
    //                 handleSaveCategoryName={handleSaveCategoryName}
    //                 mockGoalInfo={mockGoalInfo}
    //                 isGoalSubmitted={isGoalSubmitted} /> ) : null}
    //         {/* Display the color code form for categories */}
    //         <h3>Color Code Categories:</h3>
    //         {error && <p style={{ color: 'red' }}>{error}</p>}
    //         <ul>
    //             {selectedCategories.map((category) => (
    //                 <li key={category}>
    //                     <div>
    //                         <button
    //                             className="category-button"
    //                             id={`button-${category}`}
    //                             style={{ backgroundColor: colorOptions[category] || '#ccc' }}
    //                         >
    //                             {category}
    //                         </button>
    //                         <select
    //                             onChange={(e) => handleColorChange(category, e.target.value)}
    //                             value={colorOptions[category] || ''}
    //                         >
    //                             <option value="">Choose Color</option>
    //                             {Object.entries(hexColorOptions).map(([colorName, hexCode]) => (
    //                                 <option key={hexCode} value={hexCode}>
    //                                     {colorName}
    //                                 </option>
    //                             ))}
    //                         </select>
    //                     </div>
    //                 </li>
    //             ))}
    //         </ul>
    //         <button className="submit-button" type="submit" onClick={handleSubmit}>
    //             Submit
    //         </button>
    //     </div>
    // );
        <div>
            {isGoalSubmitted ? (
                <DisplayMonthlyGoal
                    selectedCategories={selectedCategories}
                    colorOptions={colorOptions}
                    hexColorOptions={hexColorOptions}
                    error={error}
                    // editableCategories={editableCategories}
                    categoryNames={categoryNames}
                    // handleEditCategory={handleEditCategory}
                    // handleSaveCategoryName={handleSaveCategoryName}
                    mockGoalInfo={mockGoalInfo}
                    isGoalSubmitted={isGoalSubmitted}
                />
            ) : (
                <div>
                    {/* Display the color code form for categories */}
                    <h3>Color Code Categories:</h3>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <ul>
                        {selectedCategories.map((category) => (
                            <li key={category}>
                                <div>
                                    <button
                                        className="category-button"
                                        id={`button-${category}`}
                                        style={{ backgroundColor: colorOptions[category] || '#ccc' }}
                                    >
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
                    <button className="submit-button" type="submit" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
}

function DisplayMonthlyGoal({ selectedCategories, colorOptions, categoryNames, error, mockGoalInfo, isGoalSubmitted }) {
    const mock = {
        email: "test@gmail.com",
        monthlyBudget: 500,
        allCategories: ["Rent", "Gym"]
    }
    const [editableCategories, setEditableCategories] = useState([]);
    // const [categoryNames, setCategoryNames] = useState({});
    const [newNames, setNewNames] = useState(categoryNames);

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
    const handleSaveCategoryName = (category) => {
        setNewNames((prevCategoryNames) => ({
            ...prevCategoryNames,
            [category]: newNames[category],
        }));
        setEditableCategories((prevEditableCategories) => prevEditableCategories.filter((item) => item !== category));

        // creates a full list of category names (whether they have been modified or not)
        const categoriesAfterEdit = selectedCategories.reduce((list, category) => {
            list[category] = newNames[category] || category;
            return list;
        }, {});

        // abstracted json object to send data to backend (Save button)
        const modifiedCategoryInfo = {
            // email: Login.email,
            allCategories: categoriesAfterEdit
        }
    };

    return (
        <div>
            <h3>Monthly Goal:</h3>
            <p>{mock.monthlyBudget}</p>
            <h3>Selected Categories:</h3>
        <ul>
        {selectedCategories.map((category) => (
            <li key={category}>
                <div>
                    <button className="category-button" id={`button-${category}`} style={{ backgroundColor: colorOptions[category] || '#ccc' }}>
                        {editableCategories.includes(category) ? (
                            <input
                                type="text"
                                value={newNames[category] || ''}
                                onChange={(e) => handleSaveCategoryName(category, e.target.value)}
                            />
                        ) : (
                            newNames[category] || category
                        )}
                    </button>
                    {editableCategories.includes(category) ? (
                        <button className="edit-button" onClick={() => handleEditCategory(category)}>
                            Save
                        </button>
                    ) : (
                        <button className="edit-button" onClick={() => handleEditCategory(category)}>
                            Edit
                        </button>
                    )}
                </div>
            </li>
        ))}
    </ul>
</div>
);
}


export default SetMonthlyGoal;