const cl = console.log
const form = document.getElementById('form')
const title = document.getElementById('title')
const content = document.getElementById('content')
const submitbtn = document.getElementById('submitbtn')
const updatebtn = document.getElementById('updatebtn')
const postcontainer = document.getElementById('postcontainer')
const loader = document.getElementById('loader')



const BASE_URL = `https://jsonplaceholder.typicode.com/`
const POST_URL = `${BASE_URL}/posts`

const createcards = (arr) =>{
    let result = ``
    arr.forEach(p => {
        result+= `  <div class="col-md-4 mt-4" id="${p.id}">
            <div class="card h-100">
                <div class="card-header">
                    <h3>${p.title}</h3>
                </div>
                <div class="card-body">
                    <p>${p.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between"><button class="btn btn-outline-info" onclick="onedit(this)">Edit</button>
                    <button class="btn btn-outline-danger" onclick="onremove(this)">Remove</button></div>
            </div>
        </div>`
    })
    postcontainer.innerHTML = result
}
const snackbar = (title, i) =>{
    Swal.fire({
        title : title,
        icon : i,
        timer : 1000
    })
}
const apicall = (url, method, body) => {
    loader.classList.remove('d-none')
   body = body ? JSON.stringify(body) : null
   return fetch(url, {
        method : method,
        body : body
    })
    .then(res => res.json())
    .catch(err => snackbar(err, 'error') )
    .finally(() => {
        loader.classList.add('d-none')
    })
}
const fetchposts = () =>{
    apicall(POST_URL, 'GET')
    .then(res => createcards(res))
}
fetchposts()
const onedit = (e) => {
    let EDIT_ID = e.closest('.col-md-4').id 
    localStorage.setItem('editid', EDIT_ID)
    let EDIT_URL = `${POST_URL}/${EDIT_ID}`
    apicall(EDIT_URL, 'GET')
    .then(res => {
        title.value = res.title
        content.value = res.body
submitbtn.classList.add('d-none')
updatebtn.classList.remove('d-none')
window.scrollTo({top: 0, behavior: 'smooth'})
    })
}
const onupdate = () => {
let UPDATE_ID = localStorage.getItem('editid')
let udpdatedobj = {
    title : title.value,
    body : content.value
}
form.reset()
let UPDATE_URL = `${POST_URL}/${UPDATE_ID}`
apicall(UPDATE_URL, 'PATCH', udpdatedobj)
.then(res => {
let div = document.getElementById(UPDATE_ID)
div.querySelector('h3').innerHTML = udpdatedobj.title
div.querySelector('p').innerHTML = udpdatedobj.body
submitbtn.classList.remove('d-none')
updatebtn.classList.add('d-none')
snackbar('Post Updated Successfully!', 'success')
let position =div.offsetTop - 200
window.scrollTo({top: position, behavior: 'smooth'})
})
}
const onremove = (e) =>{
    Swal.fire({
        title: "Do you want to Remove the Post?",
        showCancelButton: true,
        confirmButtonText: "Remove"
      }).then((result) => {
        if (result.isConfirmed) {
            let removeid = e.closest('.col-md-4').id
            let REMOVE_URL =  `${POST_URL}/${removeid}`
            apicall(REMOVE_URL, 'DELETE')
            .then(res => {
                document.getElementById(removeid).remove()
snackbar('Post Removed Successfully!', 'success')

            })
        } 
      });
}

const onsubmit =(e)=>{
e.preventDefault()
let obj = {
    title : title.value,
    body : content.value
}
apicall(POST_URL, 'POST', obj)
.then(res=>{
    let div = document.createElement('div')
    div.className = `col-md-4 mt-4`
    div.id = res.id
    div.innerHTML = ` <div class="card h-100">
                <div class="card-header">
                    <h3>${obj.title}</h3>
                </div>
                <div class="card-body">
                    <p>${obj.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between"><button class="btn btn-outline-info" onclick="onedit(this)">Edit</button>
                    <button class="btn btn-outline-danger" onclick="onremove(this)">Remove</button></div>
            </div>`
            postcontainer.prepend(div)
snackbar('Post Added Successfully!', 'success')
})
e.target.reset()
}

updatebtn.addEventListener('click', onupdate)
form.addEventListener('submit',onsubmit)



