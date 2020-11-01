
// const date = new Date().getHours();
// const getTimeAMPMFormat = (date) => {
//     let hours = date.getHours();
//     let minutes = date.getMinutes();
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12;
//     hours = hours ? hours : 12; // the hour '0' should be '12'
//     hours = hours < 10 ? '0' + hours : hours;
//     // appending zero in the start if hours less than 10
//     minutes = minutes < 10 ? '0' + minutes : minutes;
//     return hours + ':' + minutes + ' ' + ampm;
//   };
  
//   console.log(getTimeAMPMFormat(new Date("2020-10-01T10:00:00.641+00:00")));

// const arr = [1,2,3,8,4,3,9];
const arr = [ {number:1},{number:2},{number:3},{number:8},{number:4},{number:9}]
let foundNum = {
  value:false,
  TheNum:null
}
// for (let nums in arr) {
//   console.log(nums[number]);
//   if (nums[number] > 5){
//     foundNum = {
//       value:true,
//       TheNum:nums
//     }
//     break;
//   } else {
//     foundNum = {
//       value:false
//     }
//   }
// }
// console.log(foundNum);
for (i = 0; i < arr.length; i ++) {
  console.log(arr[i].number);
  if (arr[i].number > 5) {
    foundNum = {
      value:true,
      TheNum:arr[i]
    }
    break;
  } else {
    foundNum = {
      value:false,
      TheNum:arr[i]
    }
  } 
}
console.log(foundNum);