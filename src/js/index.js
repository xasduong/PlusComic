import {webComic} from "./data.js";
import {getApi, postApi} from "./function.js";
//-------------------------------
const z = document.querySelector.bind(document);
const zz = document.querySelectorAll.bind(document);
// Ten truyen, ten NV, Duong dan truyen, duong dan anh
// THe loai truyen, So chuong, Tinh trang
// Ham dung de day mang ban dau len LocalStorage
function handleViewWeb() {
    let x = localStorage.getItem('viewWeb');
    if ( x == 1){
    } else {
        postApi("viewWeb", 1); postApi("arrComic",[]);
    }
} handleViewWeb();
const extraComic = zz('.extra-btn');
const overLay = z('#overlay');
const arrComic = getApi("arrComic").sort((a, b) => {
    return b.nameChap - a.nameChap;
});
const size = screen.width; 
    // Ham nay de xu ly thanh navbar khi responsive
if (size < 479) {
    function handleNavWeb() {
        const nav = z('#comic-head .col');
        nav.onclick = () => {
            z('.list-nav').classList.toggle('open');
        }
            z('.genre-web').onclick = () => {
               z('.box-genre_list').classList.add('open');
               z('.list-nav').classList.toggle('open');
               overLay.classList.remove('close');
               }
               overLay.onclick = () => {
                   z('.box-genre_list').classList.remove('open');
                   overLay.classList.add('close');
            }
    } handleNavWeb();
}
    // Ham nay dung de xu ly du lieu o hop the loai
if (arrComic.length >= 1) {
    handleBoxGenre();
}
function handleBoxGenre() {
    const arrGenre = [];
    function getArrGenre() {
        for (let i = 0; i < arrComic.length; i++) {
            let x = arrComic[i].arrayGenre;
            for (let j = 0; j < x.length; j++) {
                let y = x[j].toLowerCase();
                arrGenre.push(y)
            }
        }
            // Xoa cac phan tu trung lap trong mang
        let arrayGenre = Array.from(new Set(arrGenre));
        return arrayGenre; 
    } ;
    const arrayGenre = getArrGenre();
    const boxGenre = z('.bg_list-genre');
    for (let i = 0; i < arrayGenre.length; i++) {
        let span  = document.createElement('span');
        span.className = 'btn';
        span.innerText = arrGenre[i];
        boxGenre.appendChild(span);
    }
    function handleComicRandom() {
        const listGenre = zz('.bg_list-genre span');
        let rd1 = Math.floor(Math.random()*arrayGenre.length);
        listGenre[rd1].classList.add('choose');
        let newArr = arrComic.filter((a) => {
            return a.listGenre.toLowerCase().includes(arrayGenre[rd1].toLowerCase());        
        })
        renderG(newArr, arrayGenre[rd1])
        let rd2 = Math.floor((Math.random() * newArr.length));
        function renderRandom() {
            const name = z('.box-genre_random > p');
            const links = zz('.bg_random-link a');
            const img = z('.bg_random-img img');
            const ranComic = newArr[rd2];
            name.innerText = ranComic.nameComic;
            z('.bg_random-img').href = ranComic.nameHref;
            links[0].href = ranComic.nameHref;
            links[1].href = ranComic.chapterHref;
            links[1].innerText = "Chương " + ranComic.nameChap;
            img.src = ranComic.imgHref;
            z('.box-genre_backgr').src = ranComic.imgHref;
            // 
        } renderRandom();
        function renderComicGenre() {
            listGenre.forEach((genre, index) => {
                genre.onclick = () => {
                    z('.bg_list-genre span.choose').classList.remove('choose');
                    listGenre[index].classList.add('choose');
                    let currentGenre = genre.innerText.toLowerCase();
                    let newArr = arrComic.filter((a) => {
                        return a.listGenre.toLowerCase().includes(currentGenre);        
                    })
                    handleRenderValue(newArr);
                    renderG(newArr, genre.innerText)
                    handleEventBox(arrComic, newArr);
                }
            })
        } renderComicGenre();
        function renderG(newArr, nameGenre) {
            const sections = zz('.bg_list-comic section');
            sections[0].innerText = newArr.length;
            sections[1].innerText = nameGenre;
        }
    } handleComicRandom();
} ;
    // Chen cac gia tri truyen tranh vao trang Web
function handleRenderValue(arrComic) {
    const boxComic = z('.box-comic');
    var today = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
    boxComic.innerHTML = arrComic.map(renderComic).join("");
    function renderComic(item) {
        let {nameComic, nameHref, imgHref, nameChap,statusComic,nameCharacter, chapterHref} = item;
        return (`
        <div class="comic-item">
            <div class="comic-i_edit btn">Edit</div>
            <div class="comic-i_infor">
                <a href= ${nameHref} target="_blank">
                    <img class="ci_infor-img" src= ${imgHref} alt="" >
                    <div class="ci_infor-main">Main: <span>${nameCharacter}</span></div>
                </a>
                <p class="ci_infor-status">${statusComic}</p>
            </div>
            <div class="comic-i_name">
                <a href=${nameHref} target="_blank" class="ci_name-comic name">${nameComic}</a>
                <a href=${chapterHref} target="_blank" class="ci_name-chap">
                    <div class="cin-chap_name">Đọc tiếp <span>Chương ${nameChap}</span></div>
                    <div class="cin-chap_update"></div>
                </a>
            </div>
            <div class="comic-i_web"></div>
        </div>
        `)
    }
    function handleTimeUpdate(getComic) {
        const chapUp = zz('.cin-chap_update');  
        let getToDay = (today.split(','))[0].split('/');
        let getTime = (today.split(','))[1].replace(/ /g, '').slice(0, -2).split(':');
        for (let i = 0; i < getComic.length; i++ ) {
            renderUpdateChap(getComic[i].updateChap, i);
        }
        function renderUpdateChap(passDay, i) {
            let getPassDay = (passDay.split(','))[0].split('/');; 
            let getPassTime = (passDay.split(','))[1].replace(/ /g, '').slice(0, -2).split(':');
            let getMeridiumCurrent = today.split(' ')[2]
            let getMeridiumPass = passDay.split(' ')[2]
            //  Xu ly viec khi ban vao trang truyen tranh -------------------------------------------------------
            let getSecond = +(getTime[2] - (getPassTime[2]));
            let getMinute = +(getTime[1] - (getPassTime[1]));
            let getDay = +(getToDay[1] - getPassDay[1]);
            let getMonth = +(getToDay[0] - getPassDay[0]);
            let getYear = +(getToDay[2] - getPassDay[2]);
            // Xu ly thoi gian getTime
                if (getMeridiumCurrent== getMeridiumPass) {
                    let getHour = +(getTime[0] - (+getPassTime[0]));
                    handleUpdateChap(getHour)
                } else {
                    let getHour = 12 + (+getTime[0]) - (+getPassTime[0]);
                    handleUpdateChap(getHour)
                }
            //  Tao ra gia tri de chen vao comic-time0
            function handleUpdateChap(getHour) {
                if (getYear == 0) {
                    //  Xu ly so nam
                    if (getMonth == 0) {
                        //  Xu ly so thang
                        if (getDay == 0) {
                            //  Xu ly so ngay
                            if (getHour == 0 ) {
                                //  Xu ly so gio
                                if (getMinute == 0) {
                                    //  Xu ly so phut
                                    if (getSecond > 0) {
                                        chapUp[i].innerText =  getSecond + " giây trước";
                                    }
                                    else {
                                        let newSecond = 60 + (+getTime[2]) - (+getPassTime[2])
                                        chapUp[i].innerText =  newSecond + " giây trước";
                                    }
                                } else if (getMinute > 0){
                                    chapUp[i].innerText =  getMinute + " phút trước";
                                } else {
                                    let newMinute = 60 + (+getTime[1]) - (+getPassTime[1]);
                                    chapUp[i].innerText =  newMinute + " phút trước";
                                }
                            } else if(getHour ==1){
                                let newMinute = 60 + (+getTime[1]) - (+getPassTime[1]);
                                if (newMinute < 60){
                                    chapUp[i].innerText =  newMinute + " phút trước";
                                } else {
                                    chapUp[i].innerText =  1 + " giờ trước";
                                }
                            } else {
                                chapUp[i].innerText =  getHour + " giờ trước";
                            }
                        } else if(getDay ==1){
                            if (getMeridiumPass == getMeridiumCurrent) {
                                let newHour = (24 - (+getPassTime[0]))  + (+getTime[0]);
                                if(newHour < 24) {
                                    chapUp[i].innerText =  newHour + " giờ trước";
                                } else {
                                    chapUp[i].innerText =  1 + " ngày trước";
                                }
                            } else {
                                chapUp[i].innerText =  1 + " ngày trước";
                            }
                        } else {
                            chapUp[i].innerText =  getDay + " ngày trước";
                        }
                    } else if(getMonth ==1){
                        handleMonth(getPassDay[2], getPassDay[0])
                    } else {
                        chapUp[i].innerText =  getMonth + " tháng trước";
                    }
                
                } else {
                    chapUp[i].innerText =  getYear + " năm trước";
                }
            }
            
            function handleMonth(year, month) {
                let day ;
                switch (month)
                {
                    case 4: ;case 6: ;case 9: ;case 11: ;
                        day =  30;
                        renderMonth(day);
                        break;
                    case 2:
                        //nếu năm nhập vào là năm nhuận thì tháng 2 sẽ có 29 ngày
                        if (year% 4 == 0 ) {
                            day =  29;
                            renderMonth(day);
                            break;
                        }
                        //ngược lại nếu không phải năm nhuận thì tháng 2 sẽ có 28 ngày
                        else {
                            day =  28;
                            renderMonth(day);
                        break;
                        }
                    default: {
                        day = 31;
                        renderMonth(day);
                    }
                };
                function renderMonth(day) {
                    let newDay = day + (+getToDay[1]) - (+getPassDay[1]);
                    if (newDay <= day) {
                        chapUp[i].innerText =  newDay + " ngày trước";
                    } else {
                        chapUp[i].innerText =  "1 tháng trước";
                    }
                }
            }
        }
    } handleTimeUpdate(arrComic);
    function renderWebsite() {
        const comicWeb = zz('.comic-i_web');
        for (let i = 0; i <arrComic.length; i++) {
            let nameWeb = arrComic[i].listWeb[0].nameWeb;
            if (nameWeb.length != 0) {
                let p = document.createElement('p');
                p.innerText = "Phiên bản khác";
                let a = document.createElement('a');
                a.target = "_blank";
                a.innerText = arrComic[i].listWeb[0].nameWeb;
                a.href = arrComic[i].listWeb[0].linkWeb;
                comicWeb[i].appendChild(p);
                comicWeb[i].appendChild(a);
            }
        }
    } 
    renderWebsite();
} handleRenderValue(arrComic);
    // Xu ly cac hanh dong cua nguoi dung vao box them truyen
    // arrComic la mang truyen tranh
    // newArrComic la mang truyen tranh moi
function handleEventBox(arrComic, newArrComic) {
    const editBtns = zz('.comic-i_edit');
    const title = z('.box-extra_title');
    const inputs = zz('form input');
    const extraBtn = z('.box-extra_btn');
    const statusComic = z('#status-comic');
    const btnHandle = zz('.be_col-handle span');
    const nameC = z('.be_col-name');
    const imgC = z('.be_col-img');
    let lengthWeb = webComic.length;
    var today = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"})
    function handleEvent() {
        const anotherBtn = z('.be_status-link');
        const boxExtra = z('.box-extra');
            // Dung de day du lieu len LocalStorage
        extraComic.forEach((btn) => {
            btn.onclick = ()=> {
                newInput(); openBox();  
                btnHandle[0].classList.add('close');
                extraBtn.innerText = "Thêm truyện";
                title.innerText = "Thêm truyện mới";
                extraBtn.onclick = () => {
                    arrComic.push(postInput());
                    postApi("arrComic", arrComic);
                    closeBox(); location.reload();
                }
            };
        })
        // Dung de sua gia tri, day len LOcalStorage
        editBtns.forEach((btn, index) => {
            btn.onclick = () => {
                openBox();
                btnHandle[0].onclick = () => {deleteComic()};
                btnHandle[0].classList.remove('close');
                extraBtn.innerText = "Cập Nhật Truyện";
                title.innerText = "Cập nhật truyện";
                    // Sua truyen
                extraBtn.onclick = () => {
                    handleLinkChapter(inputs[2].value, inputs[5].value);
                    delAndPush(); closeBox(); 
                    location.reload();
                }
                // Chen gia tri vao the input
                getInput(index); postApi("idComic", index);        
                handleValue();
            };
        })
        anotherBtn.onclick = () => {
            z('.be_another-wrap').classList.toggle('close');
        }
        btnHandle[1].onclick = () => {closeBox()};
        if (size > 480) {
            overLay.onclick =() => {closeBox()}
        }
            function closeBox() {
                boxExtra.classList.add('close');
                overLay.classList.add('close');
            };
            function openBox() {
                boxExtra.classList.remove('close');
                overLay.classList.remove('close');
            }
    } handleEvent()

    function handleValue() {
        inputs[0].oninput = () => {nameC.innerText= inputs[0].value}
        inputs[2].oninput = () => {inputLink()};
        inputs[3].oninput = () => {imgC.src= inputs[3].value}
        inputs[5].oninput = () => {
            handleLinkChapter(inputs[2].value, inputs[5].value)
        }    
        function inputLink() {
            const linkComic = inputs[2].value;
            // Tim kiem id cua website
            for (let i = 0; i < lengthWeb; i++) {
                if (linkComic.includes(webComic[i].nameWeb)) {
                    localStorage.setItem('iDweb', i);
                }
            };
        } inputLink();
    };
    //  Ham dung de xu ly duong dan den chuong truyen
    function handleLinkChapter(nameHref, nameChap) {
        let y = localStorage.getItem('iDweb');
        switch (webComic[y].nameWeb) {
            case "truyenqq": {
                let createLinkChap = nameHref + '-chap-' + nameChap + '.html';
                localStorage.setItem('chapterHref', createLinkChap);
                break;
            }  ;
            case "timtruyen3s": {
                let getNameComic = nameHref.replace(nameHref.split('-')[0], 'doc');
                let getLinkChap = getNameComic.replace('.html', "-chuong-" + nameChap + ".html")
                let createLinkChap = webComic[getIndexWebsite].linkComic + getLinkChap ;
                localStorage.setItem('chapterHref', createLinkChap);
                break;
            }  
            default: {
                localStorage.setItem('chapterHref', nameHref);
            }  
        }
    }
    // Them truyen tranh
    function delAndPush() {
        let index = getApi("idComic");
        let nowComic = newArrComic[index];
        let removeComic = arrComic.findIndex(item => item.nameComic == nowComic.nameComic);
        arrComic.splice(removeComic, 1 );
        arrComic.push(postInput());
        postApi("arrComic", arrComic);
    }
    // Xoa truyen tranh
    function deleteComic() {
        let index = getApi("idComic");
        const ans = confirm("Bạn có muốn xóa truyện " + arrComic[index].nameComic + " hay không?");
        if (ans ==1) {
            console.log("Bạn đã xóa truyện");
            postApi("arrComic", x());
            location.reload();
        } else{
            console.log("NO DELETE");
        }
    }
    function x() {
        let index = getApi("idComic");
        let nowComic = newArrComic[index];
        let removeComic = arrComic.findIndex(item => item.nameComic == nowComic.nameComic);
        arrComic.splice(removeComic, 1 );
        return arrComic;
    }
    // Cac ham xu ly voi Input
    function postInput() {
        let x =  {
            nameComic: inputs[0].value,
            nameCharacter: inputs[1].value,
            nameHref: inputs[2].value,
            imgHref: inputs[3].value,
            listGenre: inputs[4].value,
            nameChap: inputs[5].value,
            chapterHref: localStorage.getItem('chapterHref'), 
            arrayGenre: inputs[4].value.split(', '),
            listWeb: [
                {   nameWeb: inputs[6].value,
                    linkWeb: inputs[7].value
                }
            ],
            statusComic: statusComic.value,
            updateChap: today,
        }
        return x;
    }
    function newInput() {
        for( let i = 0; i< inputs.length; i++ ) {
            inputs[i].value = "";
        }
    }
    function getInput(index) {
        let nowComic = newArrComic[index];
        inputs[0].value = nowComic.nameComic;
        inputs[1].value = nowComic.nameCharacter;
        inputs[2].value = nowComic.nameHref;
        inputs[3].value = nowComic.imgHref;
        inputs[4].value = nowComic.listGenre;
        inputs[5].value = nowComic.nameChap;
        inputs[6].value = nowComic.listWeb[0].nameWeb;
        inputs[7].value = nowComic.listWeb[0].linkWeb;
        // 
        imgC.src= nowComic.imgHref;
        nameC.innerText = nowComic.nameComic;
    }
} handleEventBox(arrComic, arrComic);

function handlePostApi() {
    const inputs = zz('.box-inf label input');
    const listComic = JSON.stringify(arrComic);
    const postBtn = z('.bx_col-btn');
    inputs[0].value = listComic;
    postBtn.onclick = () => {
        let getValue = inputs[1].value;
        if (getValue.includes("[")){
            let x = confirm("Bạn có muốn cập nhật mảng truyện tranh không?");
            if(x == 1) {
                localStorage.setItem("arrComic", getValue);
                location.reload();
            } else{
                console.log("Không cập nhật!");
            }
        }
    }
} handlePostApi();

function ligthToggle() {
    const statusBtn = zz('.ci_infor-status');
    setInterval(()=> {
        for (let i = 0; i< statusBtn.length; i++) {
            statusBtn[i].classList.toggle('light')
        }
    }, 1500)
} ligthToggle();