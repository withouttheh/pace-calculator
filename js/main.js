document.addEventListener('DOMContentLoaded', function() {

    // Disable HTML5 validation() 
    document.getElementById('calc-form').noValidate = true;

    const paceInput = document.querySelectorAll('.pace-input')
    const timeInput = document.querySelectorAll('.time-input')
    const distInput = document.querySelectorAll('.dist-input');

    var valid = {};
    var isValid;
    var isFormValid;

    //--- GENERIC CHECKS ---

    function nodeListToArr(nodelist1, nodelist2) {
        var mergedArr = [...nodelist1, ...nodelist2]
        return mergedArr
    }
    // ---FUNCTIONS FOR GENERIC CHECKS---

    function isNumber(el) {
        return (!isNaN(parseInt(el.value))) ? true : false
    }

    function isEmpty(el) {
        return (el.length === 0) ? true : false
    }

    function validateRequired(el) {
        var valid = (!isEmpty(el) && isNumber(el));
        return valid;
    }

    function updateValid(arr, isValidObj, validObj) {
        for (var i = 0; i < arr.length; i++) {
            // Set true/false
            var isValidObj = validateRequired(arr[i]);

            // Set/remove border;
            if (!isValidObj) {
                showBorder(arr[i]);
            } else {
                removeBorder(arr[i]);
            }
            validObj[arr[i].id] = isValidObj
        }
        return validObj;
    }

    function canSubmit(funcObj, formObj) {
        for (var bool in funcObj) {

            // stop loop if false
            if (!funcObj[bool]) {
                formObj = false
                return formObj
            }
            //otherwise form is valid
            var formObj = true
        }
        return formObj
    }
    //---FUNCTIONS FOR ERRORS---
    function showBorder(el) {
        el.classList.add('error')
    }

    function removeBorder(el) {
        el.classList.remove('error')
    }

    function removeValue(el) {
        el.value = "";
    }

    // ---CONVERSION FUNCTIONS
    function getTotalPace(pace) {
        const minutes = parseInt(pace[0].value, 10),
            seconds = (parseInt(pace[1].value, 10) / 60),
            totalPace = minutes + seconds;
        // in minutes
        return totalPace;
    }

    function getTotalDistance(distance) {
        const kilometres = parseInt(distance[0].value, 10),
            metres = (parseInt(distance[1].value, 10) / 1000),
            totalDistance = kilometres + metres;
        // in km
        return totalDistance;
    }

    function getTotalTime(time) {
        const hrs = (parseInt(time[0].value, 10) * 60),
            mins = parseInt(time[1].value, 10),
            secs = (parseInt(time[2].value, 10) / 60),
            totalTime = hrs + mins + secs;
        // in minutes
        return totalTime;
    }

    //--- CALCULATION FUNCTIONS
    function estimateTime(pace, distance) {
        const time = pace * distance;
        return time
    }

    function estimateDistance(time, pace) {
        const distance = time / pace
        return distance
    }

    function estimatePace(time, distance) {
        const pace = time / distance
        return pace
    }

    function getFinalTime(time) {
        let timeHrs = Math.floor(time / 60),
            timeMins = Math.floor(time % 60),
            timeSecs = Math.round((((time - (timeHrs * 60) - (timeMins)) * 100) * 60) / 100);

        return { timeHrs, timeMins, timeSecs }
    }

    function getFinalDistance(distance) {
        let distanceKm = (Math.round(distance * 100) / 100);

        return distanceKm
    }

    function getFinalPace(pace) {
        let paceMins = Math.floor(pace % 60),
            paceSecs = Math.round((((pace - paceMins) * 100) * 60) / 100);

        return { paceMins, paceSecs }
    }

    function addZeroToTime(time) {
        var hours = time.timeHrs,
            minutes = time.timeMins,
            seconds = time.timeSecs;

        if (hours < 10) {
            var hours = '0' + hours;
        }
        if (minutes < 10) {
            var minutes = '0' + minutes;
        }

        if (seconds < 10) {
            var seconds = '0' + (Math.floor(minutes * 100) / 100)
        }
        return { hours, minutes, seconds }
    }

    function addZeroToPace(pace) {
        var minutes = pace.paceMins,
            seconds = pace.paceSecs;

        if (minutes < 1) {
            var minutes = '0'
        }

        if (seconds < 10) {
            var seconds = '0' + (Math.floor(seconds * 100) / 100)
        }
        return { minutes, seconds }
    }

    function calculateTime(distance, pace) {

        const total_dist = getTotalDistance(distance),
            total_pace = getTotalPace(pace);

        const estimatedTime = estimateTime(total_dist, total_pace)

        const finalTime = getFinalTime(estimatedTime)

        return addZeroToTime(finalTime);
    }

    function calculateDistance(time, pace) {
        const total_time = getTotalTime(time),
            total_pace = getTotalPace(pace);

        const estimatedDistance = estimateDistance(total_time, total_pace)

        const finalDistance = getFinalDistance(estimatedDistance)

        return finalDistance
    }

    function calculatePace(time, distance) {
        const
            total_time = getTotalTime(time),
            total_dist = getTotalDistance(distance);

        const estimatedPace = estimatePace(total_time, total_dist)

        const finalPace = getFinalPace(estimatedPace)

        return addZeroToPace(finalPace)
    }

    //--- DISPLAY FUNCTIONS
    const container = document.querySelector('.container'),
        alertBG = document.createElement('div'),
        alertDiv = document.createElement('div'),
        span = document.createElement('span'),
        btn = document.createElement('button');

    function createChildren(val1, val2) {
        return [val1, val2]
    }

    function setAttributes(el1, el2, el3, el4) {
        el1.setAttribute('class', 'alert-box-bg');
        el2.setAttribute('class', 'alert-box');
        el3.setAttribute('class', 'results');
        el4.setAttribute('class', 'confirm-btn');
    }

    function addClass(el1, el2) {
        el1.classList.add('error-box')
        el2.classList.add('error-btn')
    }

    function appendChildren(parent, children) {
        children.forEach(function(child) {
            parent.appendChild(child)
        })
    }

    function displayTime(time) {
        container.appendChild(alertBG);
        alertBG.appendChild(alertDiv);

        const children = createChildren(span, btn)

        appendChildren(alertDiv, children)

        setAttributes(alertBG, alertDiv, span, btn);

        // alertBG.classList.add('active')

        span.textContent = `Your  time is ${time.hours}:${time.minutes}:${time.seconds}.`
        btn.textContent = `OK`
    }

    function displayDistance(distance) {
        container.appendChild(alertBG);
        alertBG.appendChild(alertDiv);

        const children = createChildren(span, btn)

        appendChildren(alertDiv, children)

        setAttributes(alertBG, alertDiv, span, btn);

        // alertBG.classList.add('active')

        span.textContent = `Your distance is ${distance} km.`
        btn.textContent = `OK`
    }

    function displayPace(pace) {
        container.appendChild(alertBG);
        alertBG.appendChild(alertDiv);

        const children = createChildren(span, btn)

        appendChildren(alertDiv, children)

        setAttributes(alertBG, alertDiv, span, btn);

        span.textContent = `Your  pace is ${pace.minutes}:${pace.seconds}`;
        btn.textContent = `OK`
    }

    function displayError() {
        container.appendChild(alertBG);
        alertBG.appendChild(alertDiv);

        const children = createChildren(span, btn)

        appendChildren(alertDiv, children)

        setAttributes(alertBG, alertDiv, span, btn)

        addClass(alertDiv, btn)

        span.textContent = `Value is required`
        btn.textContent = `OK`
    }

    // --ESTIMATE TIME
    document
        .getElementById('time-calc-btn').addEventListener("click", function(event) {

            const elements = nodeListToArr(distInput, paceInput);

            for (var i = 0; i < timeInput.length; i++) {
                removeValue(timeInput[i])
                removeBorder(timeInput[i]);
            }

            const validObject = updateValid(elements, isValid, valid)

            const submission = canSubmit(validObject, isFormValid)

            if (submission) {
                event.preventDefault();

                const calculatedTime = calculateTime(distInput, paceInput);
                displayTime(calculatedTime);
            }

            if (!submission) {
                event.preventDefault();
                displayError();
            }
        });
    // --ESTIMATE DISTANCE
    document
        .getElementById('dist-calc-btn').addEventListener("click", function(event) {

            const elements = nodeListToArr(timeInput, paceInput);

            for (var i = 0; i < distInput.length; i++) {
                removeValue(distInput[i])
                removeBorder(distInput[i]);
            }

            const validObject = updateValid(elements, isValid, valid)

            const submission = canSubmit(validObject, isFormValid)

            if (submission) {
                event.preventDefault();

                const calculatedDistance = calculateDistance(timeInput, paceInput);
                displayDistance(calculatedDistance)

            }

            if (!submission) {
                event.preventDefault();
                displayError()
            }
        });

    // --ESTIMATE PACE
    document
        .getElementById('pace-calc-btn').addEventListener("click", function(event) {

            const elements = nodeListToArr(timeInput, distInput);

            for (var i = 0; i < paceInput.length; i++) {
                removeValue(paceInput[i])
                removeBorder(paceInput[i]);
            }

            const validObject = updateValid(elements, isValid, valid)

            const submission = canSubmit(validObject, isFormValid)

            if (submission) {
                event.preventDefault();

                const calculatedPace = calculatePace(timeInput, distInput);
                displayPace(calculatedPace);
            }

            if (!submission) {
                event.preventDefault();
                displayError()
            }
        });
    // --CLOSE ALERT 
    btn
        .addEventListener("click", function() {
            alertBG.remove();
            alertDiv.remove();
        })
});