// ==UserScript==
// @name     Speed Grader Pager for CANVAS
// @author   Johann Gan
// @version  1
// @grant    none
// @match https://canvas.rice.edu/courses/*/gradebook/speed_grader*
// ==/UserScript==

// ***PUT YOUR STUDENTS' IDS (AS INTEGERS) HERE*** //
//   To see a student's ID, go to the "People"
//   section on the course page, click on the
//   student's name to view their profile, and
//   look at the page URL. The student ID should
//   be the number at the end.
//
//   The URL should have the format:
//   ".../courses/<course #>/users/<Student ID>
var ids = [];
// ********************************* //

function useSpeedGraderPager() {
    return parent.document.location.pathname.endsWith("speed_grader") &&
        ids.length > 0;
}

function speedGraderGetSID() {
    return parseInt(parent.document.location.hash.match(/%22student_id%22%3A%22(\d+)%22/)[1]);
}

function speedGraderPageToSID(sid) {
    parent.document.location.assign(parent.document.location.href.replace(/(%22student_id%22%3A%22)\d+(%22)/, "$1"+sid+"$2"));
}

function speedGraderPager(event) {
    if(!useSpeedGraderPager()) {
        return;
    }

    if(event.ctrlKey && event.altKey) {
        if (event.code === "ArrowLeft" || event.code === "ArrowUp") {
            let currentIdx = ids.indexOf(speedGraderGetSID());
            if (currentIdx > 0) {
                speedGraderPageToSID(ids[currentIdx-1]);
            }
        } else if (event.code === "ArrowRight" || event.code === "ArrowDown") {
            let currentIdx = ids.indexOf(speedGraderGetSID());
            if (currentIdx < ids.length-1) {
                speedGraderPageToSID(ids[currentIdx+1]);
            }
        }
    }
}

window.addEventListener("keydown", speedGraderPager);
document.body.onload = function() {
    // Observe for when the speedgrader iframe is dynamically created, then bind the event listener
    var observer = new MutationObserver(function() {
        var iframe = document.getElementById("speedgrader_iframe");
        iframe.contentWindow.addEventListener("keydown", speedGraderPager);

        // Set up event listener upon reloads
        iframe.onload = function() {
          iframe.contentWindow.addEventListener("keydown", speedGraderPager);
        }
    });
    observer.observe(document.getElementById("iframe_holder"), {childList: true});
};
