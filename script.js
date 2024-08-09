document.addEventListener("DOMContentLoaded", function () {
    const predictMonthlyButton = document.getElementById("predictMonthlyButton");
    const predictAnnualButton = document.getElementById("predictAnnualButton");

    const resultElement = document.getElementById("result");
    const languageSelection = document.getElementsByName("language");

    const ttsLanguage = {
        telugu: "te-IN",
        hindi: "hi-IN",
        english: "en-US",
    };

    const synth = window.speechSynthesis;

    const audioMapping = {
        telugu: {
            "వయస్సు:": "Age-tel.mp3",
            "లింగం:": "gender-tel.mp3",
            "బిఎమ్ఐ:": "BMI-tel.mp3",
            "పిల్లల సంఖ్య:": "No of children-tel.mp3",
            "ధూమపానం:": "smoker-tel.mp3",
            "ఆల్కహాల్ సేవన:": "alcohol consumption-tel.mp3",
            "ప్రాంతం:": "region-tel.mp3",
        },
        hindi: {
            "आयु:": "Age-hi.mp3",
            "लिंग:": "gender-hi.mp3",
            "बीएमआई:": "BMI-hi.mp3",
            "बच्चों की संख्या:": "No of children-hi.mp3",
            "स्मोकर:": "smoker-hi.mp3",
            "शराब की सेवन:": "alcohol consumption-hi.mp3",
            "क्षेत्र:": "region-hi.mp3",
        },
        english: {
            "Age:": "Age.mp3",
            "Gender:": "gender.mp3",
            "BMI:": "BMI.mp3",
            "Number of Children:": "No of children.mp3",
            "Smoker:": "smoker.mp3",
            "Alcohol Consumption:": "alcohol consumption.mp3",
            "Region:": "region.mp3",
        },
    };

    const languageData = {
        telugu: {
            labels: {
                ageLabel: "వయస్సు:",
                genderLabel: "లింగం:",
                bmiLabel: "బిఎమ్ఐ:",
                childrenLabel: "పిల్లల సంఖ్య:",
                smokerLabel: "ధూమపానం:",
                alcoholLabel: "ఆల్కహాల్ సేవన:",
                regionLabel: "ప్రాంతం:",
            },
            options: {
                yes: "ఔను",
                no: "లేదు",
                east: "పూర్వ",
                west: "పశ్చిమ",
                north: "ఉత్తర",
                south: "దక్షిణ",
            },
        },
        hindi: {
            labels: {
                ageLabel: "आयु:",
                genderLabel: "लिंग:",
                bmiLabel: "बीएमआई:",
                childrenLabel: "बच्चों की संख्या:",
                smokerLabel: "स्मोकर:",
                alcoholLabel: "शराब की सेवन:",
                regionLabel: "क्षेत्र:",
            },
            options: {
                yes: "हाँ",
                no: "नहीं",
                east: "पूर्व",
                west: "पश्चिम",
                north: "उत्तर",
                south: "दक्षिण",
            },
        },
        english: {
            labels: {
                ageLabel: "Age:",
                genderLabel: "Gender:",
                bmiLabel: "BMI:",
                childrenLabel: "Number of Children:",
                smokerLabel: "Smoker:",
                alcoholLabel: "Alcohol Consumption:",
                regionLabel: "Region:",
            },
            options: {
                yes: "Yes",
                no: "No",
                india: "India",
                us: "United States",
                east: "East",
                west: "West",
                north: "North",
                south: "South",
            },
        },
    };

    function speakText(text) {
        let lang;
        for (let i = 0; i < languageSelection.length; i++) {
            if (languageSelection[i].checked) {
                lang = languageSelection[i].value;
                break;
            }
        }

        const audioFileName = audioMapping[lang][text];
        if (audioFileName) {
            const audio = new Audio(`./audio/${audioFileName}`);
            audio.play();
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = ttsLanguage[lang];
            synth.speak(utterance);
        }
    }

    function updateLabelsAndOptions(language) {
        const labels = languageData[language].labels;
        const options = languageData[language].options;
        for (const key in labels) {
            if (Object.hasOwnProperty.call(labels, key)) {
                const element = document.getElementById(key);
                if (element) {
                    element.textContent = labels[key];
                }
            }
        }
        for (const key in options) {
            if (Object.hasOwnProperty.call(options, key)) {
                const element = document.querySelector(`select[name="${key}"`);
                if (element) {
                    element.innerHTML = '';
                    for (const optionKey in options) {
                        if (Object.hasOwnProperty.call(options, optionKey)) {
                            const option = document.createElement("option");
                            option.value = optionKey;
                            option.text = options[optionKey];
                            element.appendChild(option);
                        }
                    }
                }
            }
        }
    }

    languageSelection.forEach((languageOption) => {
        languageOption.addEventListener("change", function () {
            const selectedLanguage = this.value;
            updateLabelsAndOptions(selectedLanguage);
            speakText("Language has been updated.");
        });
    });

    // Add event listeners to all the '🔉' buttons
    const buttons = document.getElementsByClassName('btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function () {
            speakText(this.previousElementSibling.textContent);
        });
    }

    const selectedLanguageElement = document.querySelector('input[name="language"]:checked');
    const selectedLanguage = selectedLanguageElement ? selectedLanguageElement.value : 'english';

    function predictPremium(age, gender, bmi, children, smoker, alcohol, region, isAnnual = true) {
        let basePremium = 100000;

        if (age >= 18 && age <= 30) {
            basePremium += 50000;
        } else if (age > 30 && age <= 50) {
            basePremium += 70000;

        }
        if(age>=50 && age<=75){
            basePremium +=90000;
        }else if(age> 75 && age<=100){
            basePremium +=110000;
        }
    
        else {
            basePremium += 13000;
        }

        if (gender === "female") {
            basePremium -= 1000;
        }

        if (bmi > 25) {
            basePremium += 3000;
        }

        basePremium += children * 1000;

        if (smoker === "yes") {
            basePremium += 7000;
        }

        if (alcohol === "yes") {
            basePremium += 2000;
        }

        switch (region) {
            case "east":
                basePremium += 500;
                break;
            case "west":
                basePremium += 700;
                break;
            case "north":
                basePremium += 600;
                break;
            case "south":
                basePremium += 800;
                break;
        }

        basePremium += 5000;

        if (!isAnnual) {
            basePremium /= 12;
        }

        return basePremium;
    }

    predictMonthlyButton.addEventListener("click", function () {
        calculatePremium(false);
    });

    predictAnnualButton.addEventListener("click", function () {
        calculatePremium(true);
    });

    function calculatePremium(isAnnual) {
        const age = parseFloat(document.getElementById("age").value);
        const gender = document.getElementById("gender").value;
        const bmi = parseFloat(document.getElementById("bmi").value);
        const children = parseInt(document.getElementById("children").value);
        const smoker = document.getElementById("smoker").value;
        const alcohol = document.getElementById("alcohol").value;
        const region = document.getElementById("region").value;

        const calculatedPremium = predictPremium(age, gender, bmi, children, smoker, alcohol, region, isAnnual);

        resultElement.textContent = `Predicted Premium: ₹${calculatedPremium.toFixed(2)}${isAnnual ? ' per year' : ' per month'}`;
    }
});
