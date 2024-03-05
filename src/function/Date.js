const Date = ()=>{


// Create a new Date object
const currentDate = new Date();
                   
// Get the year, month, and day components from the date object
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
const day = String(currentDate.getDate()).padStart(2, '0');

// Format the date as "YYYY-MM-DD"
const formattedDate = `${year}-${month}-${day}`;
return formattedDate;
// console.log(formattedDate); // Output: "2022-02-25" (for example)
}
export default Date;