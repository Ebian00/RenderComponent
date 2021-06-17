import {LitElement, html,css,} from "https://unpkg.com/lit-element/lit-element.js?module";
class RenderComponent extends LitElement {

    static get properties() {
        return {
          serverURL : {type: String},
          guz : {type : String},
          getEntity : {type : String},
          myArray : { type : Array },
          contentName : {type:  String},
          jwt : {type : String},
          link : {type: Object}

        }
      }
      constructor() {
        super(); 
        this.link = new Object;
        console.log(this.guz);
        this.getEntity = "getEntity/";
        this.serverURL = "https://localhost:8443/caas/";
        //this.getResource()
      }
    render() {
        return html`
            <p id='content'> check guz </p>
        `;
      }
connectedCallback (){
    console.log(this)
   // this.getResource()
}
 
     async getResource(){ 
         console.log("hello from the render component, the id is" + this.guz);
      var getElement = this.serverURL+this.getEntity+this.guz;
       var objectKeys = Array;
      console.log(getElement)
        fetch(getElement, {
          method: 'GET',
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'include', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow', // manual, *follow, error
          credentials: 'include',
        })
        .then((response) => response.json())
        .then((responseText) => {
          var typeOfElement = responseText["type"];
          if(typeOfElement === undefined){
            typeOfElement = responseText["metadata"]["type"]
          }
          console.log(" type of element "+ typeOfElement);
          if(typeOfElement==="image"){
            this.renderImage(responseText["response"]);
          }
          else if( typeOfElement==="html"){
            this.renderHtml(responseText["response"]);
          }
          else if(typeOfElement==="pdf"){
           this.getPDF(this.shadowRoot.getElementById('inputfield').value);
          }
          else{
            alert("the type of the object is not supported");
          }
        })
        .catch((error) => {
            alert("The data could not be fetched");
            console.error(error);
        });
}

 getPDF(id){ 
  var getElement = this.serverURL+"getPdfByte/"+id;
  fetch(getElement, {
    method: 'GET',
    headers: {
      'Authorization':  this.jwt ,
        'Content-Type': 'application/json'
   }
  })
  .then(response => {
    console.log("here is the response")
    console.log(response);
   const filename =  "check";
   response.blob().then(blob => {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.setAttribute("download", filename);
    a.text = "Download Me "
    this.shadowRoot.getElementById('placeholder').append(a);
 });
});
}
    renderImage(image){
      console.log("we are in the renderImage function")
      this.shadowRoot.getElementById('content').innerHTML = '<img width= 50% height= auto src="data:image/jpg;base64,'+image+'"></img>';
    }
   /* renderPDF(pdf){
      this.shadowRoot.getElementById('placeholder').innerHTML = '<a onClick='+this.openPDF+' href=-- name=' +this.contentName+'>Download Pdf</a>';
    }*/

    openPDF(){
      var file = new Blob([data], { type: 'application/pdf' });
     var fileURL = URL.createObjectURL(file);
      window.open(this.link);
      this.shadowRoot.getElementById('content').innerHTML=''
    }
    renderHtml(html){
      this.shadowRoot.getElementById('content').innerHTML = html;
    }

    submit(){
      var inputValue = this.shadowRoot.getElementById('inputfield').value;
      console.log("inputValue = " + inputValue)
      if(inputValue===undefined&& inputValue===null){
        alert("the input field is empty");
      }
      else{
        this.getResource(inputValue);
      }
      this.shadowRoot.getElementById('placeholder').innerHTML = ""
    }

    static get styles() {
      return css`
        input { width: 50%;
        height: 40px;
        border: 2pxf solid #aaa;
        border-radius:4px;
        margin:8px 0;
        outline:none;
        padding:8px;
        box-sizing:border-box;
        transition:.3s; }

        input[type=text]:focus{
        border-color:dodgerBlue;
        box-shadow:0 0 8px 0 dodgerBlue;
        }

        button { width: 6%;
        height: 40px;
        border: 2pxf solid #aaa;
        border-radius:4px;
        margin:8px 0;
        outline:none;
        padding:8px;
        box-sizing:border-box;
        transition:.3s; }

        button:focus{
        border-color:dodgerBlue;
        box-shadow:0 0 8px 0 dodgerBlue;
  }
      `;
    }
}
customElements.define('render-component', RenderComponent);
