// CSCI 2720 Assignment 1


document.querySelector("#Special").onclick = function() {
    var tasks = document.querySelector("#tasks");
    if (tasks.style.display != "block") {
        tasks.style.display = "block";
    } else {
        tasks.style.display = "none";
    }
    //alert("testing");
}

function changeAlign() {
    var align = document.querySelectorAll(".title");
    for (let index = 0; index < align.length; index++) {
        if (align[index].style.textAlign == "right") {
            align[index].style.textAlign = "left";
        } else if (align[index].style.textAlign == "center") {
            align[index].style.textAlign = "right";
        } else {
            align[index].style.textAlign = "center";
        }
    }



}

function AddNewHobby() {
    let hobby = prompt("Please enter your new hobby:");
    if (hobby != null & hobby.length > 0) {
        let newHobby = document.createElement("div");
        let element = '<div>' + hobby + '</div>';
        newHobby.innerHTML = element;
        newHobby.className = "col-3";
        newHobby.classList.add("overflow-auto");
        document.querySelector("#hobby-list").appendChild(newHobby);

    }
}

function Scrollprogress() {
    var scroll = document.querySelector(".progress");
    if (scroll.classList.contains("d-none")) {
        scroll.classList.remove("d-none");
        //document.querySelector("#bar").classList.add("progress-bar-striped");
        //document.querySelector("#bar").classList.remove("bg-primary");
        //console.log(document.querySelector("#bar").classList);
        // scroll.classList.add("sticky-top");

    } else {
        scroll.classList.add("d-none");
    }
    //console.log(scroll.classList);
    //console.log(document.querySelector("#bar").classList);
    document.querySelector(".progress-bar").style.width = Scroll();
}


window.onscroll = function() { Scroll() }

function Scroll() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    //console.log("scrolled:", winScroll);
    document.querySelector(".progress-bar").style.width = String(scrolled) + "%";
    var bar = document.querySelector("#tasks")
    var sticky = bar.offsetTop + bar.offsetHeight;
    // console.log("sticky:", sticky);
    // console.log("window", window.scrollY)
    //console.log(window.pageYOffset);
    if (winScroll > sticky) {
        document.querySelector("#bar").classList.add("fixed-top");
    } else {
        document.querySelector("#bar").classList.remove("fixed-top");
    }
    //console.log("classlist:", document.querySelector("#bar").classList);
}

function processform() {

    // Citation: This function is from CUHK CSCI 2720 Lab 3
    const regex = /^[\w\-\/]*@[\w\-]/;

    var valid = false;
    var check = document.querySelectorAll("input[name=new-color]:checked");
    var radio = document.querySelectorAll(".form-check-input");
    console.log(check.length);
    if (check.length > 0) {
        valid = true;
        console.log("length checked");
    }
    //console.log(document.querySelectorAll("input[name=new-color]:checked"));
    if (!document.querySelector("#new-email").value.match(regex) || valid == false || document.querySelector("#new-comment").value.length <= 0) {
        if (!document.querySelector("#new-email").value.match(regex)) {
            document.querySelector("#new-email").classList.add("is-invalid");
            document.querySelector("#new-email").classList.remove("is-valid");
        }
        if (!valid) {
            console.log("false");
            for (let index = 0; index < radio.length; index++) {
                radio[index].classList.add("is-invalid");
            }
        }
        if (document.querySelector("#new-comment").value.length <= 0) {
            document.querySelector("#new-comment").classList.add("is-invalid");
            document.querySelector("#new-comment").classList.remove("is-valid");
        }
    } else {
        document.querySelector("#new-email").classList.remove("is-invalid");
        document.querySelector("#new-comment").classList.remove("is-invalid");
        for (let index = 0; index < radio.length; index++) {
            radio[index].classList.remove("is-invalid");
        }
        // 1. Set up a new element
        let newComment = document.createElement("div");
        // the below is same as previous
        let element = '<div><svg height="100" width="100"><circle cx="50" cy="50" r="40"></svg></div><div><h5></h5><p></p></div>';
        newComment.innerHTML = element;

        // 2. Set the classes of the div and its children div’s
        //    Note: instead of class, className is used
        // add new div inside the div#comment
        // have same class but  different id
        newComment.className = "d-flex";
        // the circle
        newComment.querySelectorAll("div")[0].className = "flex-shrink-0"; // 1st div
        // user name and comment
        newComment.querySelectorAll("div")[1].className = "flex-grow-1"; // 2nd div

        // 3. Increment the comment id
        let lastComment = document.querySelector("#comments").lastElementChild; // instead of lastChild for div element
        newComment.id = 'c' + (Number(lastComment.id.substr(1)) + 1);

        // 4. Change contents of <h5> and <p> according to form input with id
        newComment.querySelector("h5").innerHTML = document.querySelector("#new-email").value;
        newComment.querySelector("p").innerHTML = document.querySelector("#new-comment").value;

        // 5. Get the color choice from the radio buttons
        let color = document.querySelectorAll("input[name=new-color]:checked")[0].value;

        // 6. Change the fill color of the SVG circle
        newComment.querySelector("circle").setAttribute("fill", color);

        // 7. Append it to the div #comment using
        document.querySelector("#comments").appendChild(newComment);

        // 8. After this, reset the form to clear the contents
        document.querySelector("form").reset();

        savefile();
    }

}

// document.getElementById("buttonAdd").onclick() = function() {
//     alert("clicked");
// }
function loadfile() {
    try {

        var http = new XMLHttpRequest();
        http.open('HEAD', 'comment/comment.txt', false);
        http.send();
        if (http.status === 200) {
            fetch('comment/comment.txt').then(res => res.text()).then(txt => {
                // directly cover the old div#comment
                document.querySelector("#comments").innerHTML = txt;
                console.log(txt)
            });
            alert("File loaded");
        } else {
            alert("No file is loaded");
        }


    } catch (error) {

    }

};

function savefile() {

    let comment = document.querySelector("#comments").innerHTML;
    //alert("testing saving ");
    fetch('comment/comment.txt', {
        method: 'PUT',
        body: comment
    });
    alert("File saved.")
};

window.onload = function() {
    loadfile();
    Resize();
};


(function() {


    window.addEventListener('resize', function() {
        //console.log(this.screen.width, "  ", window.innerWidth);
        Resize();
    })

})();


function Resize() {
    if (screen.width < 600 || window.innerWidth < 600) {
        document.querySelector("#about-me").classList.remove("col-7");
        document.querySelector("#about-me").classList.add("col-12");
        document.querySelector("#hobby").classList.remove("col-5");
        document.querySelector("#hobby").classList.add("col-12");
        document.querySelector("#CU-pic").classList.remove("col-6");
        document.querySelector("#CU-pic").classList.add("col-12");
        document.querySelector("#responsive").classList.remove("col-6");
        document.querySelector("#responsive").classList.add("col-12");
    } else {
        document.querySelector("#about-me").classList.remove("col-12");
        document.querySelector("#about-me").classList.add("col-7");
        document.querySelector("#hobby").classList.remove("col-12");
        document.querySelector("#hobby").classList.add("col-5");
        document.querySelector("#CU-pic").classList.remove("col-12");
        document.querySelector("#CU-pic").classList.add("col-5");
        document.querySelector("#responsive").classList.remove("col-12");
        document.querySelector("#responsive").classList.add("col-5");
    }
}

function darkmode() {
    var body = document.querySelector("body");
    // body.style.backgroundColor = "black";
    var title = document.querySelectorAll(".title");
    // comment.style.color = "white";
    var navbar = document.querySelectorAll(".nav-tasks");
    var navbg = document.querySelectorAll(".nav-tasks-bg");
    //console.log(navbar.length);
    //console.log(navbg.length);
    for (let index = 0; index < navbar.length; index++) {
        //console.log(title[index].classList);
        title[index].classList.toggle("bg");
        //console.log(title[index].classList);
    }
    body.classList.toggle("darkmode");
    body.classList.toggle("bg-dark");

    for (let index = 0; index < navbar.length; index++) {
        navbar[index].classList.toggle("btn-outline-dark");
        navbar[index].classList.toggle("btn-outline-light");

    }
    for (let index = 0; index < navbg.length; index++) {
        navbg[index].classList.toggle("bg-light");
        navbg[index].classList.toggle("bg-dark");
        navbg[index].classList.toggle("navbar-light");
        navbg[index].classList.toggle("navbar-dark");

    }

}
