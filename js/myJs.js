var expOperators = /\+|-|\/|x/;

$(function() {
    //Auxiliar variables to keep track of the values pressed by the user
    let mainDisplayContent = "0";
    let secondaryDisplayContent = "0";
    let previousKeyPressed = "AC";

    $('button').click(function(e) { //Every time a button is press set is value to the performOperation() function
        e.preventDefault();
        let buttonClicked = $(this).attr('data-value');
        performOperation(buttonClicked);
    });

    function performOperation(keyPress) {
        switch (keyPress) {
            case 'AC': //Clear the calculator-display and the auxiliar variables
                secondaryDisplayContent = "0";
                $('.secondary-display').html(secondaryDisplayContent);
                mainDisplayContent = "0";
                $('.main-display').html(mainDisplayContent);
                break;
            case 'CE':
                //if +-x/ is in the main-display and CE is press it is the same as press AC
                if (expOperators.test(mainDisplayContent)) {
                    secondaryDisplayContent = "0";
                    $('.secondary-display').html(secondaryDisplayContent);
                    mainDisplayContent = "0";
                    $('.main-display').html(mainDisplayContent);
                    keyPress = "AC";
                    break;
                }
                //Delete the entry from the secondary-display
                secondaryDisplayContent = secondaryDisplayContent.substring(0, secondaryDisplayContent.lastIndexOf(mainDisplayContent));
                if (secondaryDisplayContent.length == 0)
                    secondaryDisplayContent = "0";
                $('.secondary-display').html(secondaryDisplayContent);
                //Add the last operator at the main-display
                mainDisplayContent = secondaryDisplayContent.charAt(secondaryDisplayContent.length - 1);
                $('.main-display').html(mainDisplayContent);
                break;
            case '+':
            case '-':
            case 'x':
            case '/':
                //Check if the previous key press was and operation's one.
                if (expOperators.test(secondaryDisplayContent.charAt(secondaryDisplayContent.length - 1)))
                    break;
                //Delete the comma if there is no number after it.
                if (mainDisplayContent.charAt(mainDisplayContent.length - 1) === ',')
                    secondaryDisplayContent = secondaryDisplayContent.substring(0, secondaryDisplayContent.length - 1);

                mainDisplayContent = keyPress;
                $('.main-display').html(mainDisplayContent);
                secondaryDisplayContent += keyPress;
                $('.secondary-display').html(secondaryDisplayContent);
                break;
            case '9':
            case '8':
            case '7':
            case '6':
            case '5':
            case '4':
            case '3':
            case '2':
            case '1':
            case '0':
                //In case that the answer was in the mainDisplay it gets deleted
                if (previousKeyPressed === "=") {
                    mainDisplayContent = "";
                    secondaryDisplayContent = "";
                }
                //In case there is an operator on the main-display 
                if ((expOperators.test(mainDisplayContent) && mainDisplayContent.length === 1))
                    mainDisplayContent = "";

                //To avoid situations like "0132"
                if (mainDisplayContent === "0") {
                    mainDisplayContent = "";
                }
                //To avoid situations after an operator sign like "1243-0122" 
                //If secondaryDisplayContent ends with and operator skip it
                if (!isNaN(secondaryDisplayContent.charAt(secondaryDisplayContent.length - 1))) {
                    let matches = secondaryDisplayContent.match(/\d+\.\d+|\d+/g); //Split the secondaryDisplayContent into mathematical terms
                    try { //If last term has a 0 just dont add other at the end
                        if (/^0/.test(matches[matches.length - 1]) && !/\./.test(matches[matches.length - 1])) {
                            secondaryDisplayContent = secondaryDisplayContent.substring(0, secondaryDisplayContent.length - 1);
                        }
                    } catch (TypeError) {
                        secondaryDisplayContent = "";
                    }
                }
                mainDisplayContent += keyPress;
                secondaryDisplayContent += keyPress;
                $('.main-display').html(mainDisplayContent);
                $('.secondary-display').html(secondaryDisplayContent);
                break;
            case '.':
                if (/\.|\+|-|\/|x/.test(mainDisplayContent)) //Not two dots or a +. 
                    break;
                mainDisplayContent += keyPress;
                secondaryDisplayContent += mainDisplayContent.charAt(mainDisplayContent.length - 1);
                $('.main-display').html(mainDisplayContent);
                $('.secondary-display').html(secondaryDisplayContent);
                break;
            case '=':
                //If last input was an operator skip this case.
                if (/[,\+-\/x]$/.test(mainDisplayContent))
                    break;
                //Add parenthesis to achive a correct perform like "(2 / 3) + (1 * 3)" instead of "2/3+1*3"
                let operation = "(" + secondaryDisplayContent.replace(/(\d)(\+|-)/g, "$1)$2(") + ")";
                operation = operation.replace(/x/g, "*").replace(/\(\)/g, "");
                let answer = eval(operation).toString();
                //Deal with infinity results or 0/0 divisions
                if (answer === "Infinity" || isNaN(answer)) {
                    secondaryDisplayContent = "0";
                    $('.secondary-display').html(secondaryDisplayContent);
                    mainDisplayContent = "0";
                    $('.main-display').html(mainDisplayContent);
                    break;
                }
                mainDisplayContent = answer
                secondaryDisplayContent = answer;
                $('.main-display').html(mainDisplayContent);
                $('.secondary-display').html(secondaryDisplayContent);
                break;
            case '*_1':
                if (/[,\+-\/x]$/.test(mainDisplayContent)) //You can't invert an operator
                    break;

                let numberToInvert = eval(mainDisplayContent + "*-1").toString();
                let lastEntry = secondaryDisplayContent.lastIndexOf(mainDisplayContent);
                secondaryDisplayContent = secondaryDisplayContent.substring(0, lastEntry) + numberToInvert;
                mainDisplayContent = numberToInvert;
                $('.main-display').html(mainDisplayContent);
                $('.secondary-display').html(secondaryDisplayContent);
                break;
        }
        previousKeyPressed = keyPress;
    }
});