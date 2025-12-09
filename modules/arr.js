function isArrEqual(arr1,arr2) {
    //we can do this THE HARD WAY or THE EASY WAY
    
    //easy way
    return JSON.stringify(arr1) === JSON.stringify(arr2)

    //hard way (aint doing that)

    //psuedo code

        //check if length same
        //loop through and check if same
}
function arrToPos(arr) {
    return {
        x:arr[0],
        y:arr[1],
    }
}