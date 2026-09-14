function checkEligibility() {

    let age = document.getElementById("age").value;
    let result = document.getElementById("result");

    if (age === "") {
        result.innerHTML = "Please enter your age";
    }
    else if (age >= 18) {
        result.innerHTML = "You are eligible to vote.";
    }
    else {
        result.innerHTML = "You are not eligible to vote.";
    }
}