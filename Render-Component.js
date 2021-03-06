import {LitElement, html,css,} from "https://unpkg.com/lit-element/lit-element.js?module";
class RenderComponent extends LitElement {

    static get properties() {
        return {
          serverURL : {type: String},
          id : {type : String},
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
        this.getEntity = "getEntity/";
        this.serverURL = "https://localhost:8443/caas/";
        //this.getResource()
      }
    render() {
        return html`
        <div id="content" class="placeholder"></div>
        `;
      }
    firstUpdated(changedProperties) {
        changedProperties.forEach((oldValue, propName) => {
          console.log(`${propName} changed. oldValue: ${oldValue}`);
        });
        
        this.getResource();
      }
      drop(e){
        e.preventDefault();
        console.log(e)
       e.preventDefault();
      var data = e.dataTransfer.getData("text");
     console.log(data)
     this.getResource(data);
        this.name = data;
      }
      allowDrop(e){
        e.preventDefault();
    }
 
 
     async getResource(){ 
         console.log("hello from the render component, the id is" + this.id);
      var getElement = this.serverURL+this.getEntity+this.id;
      var blobObject ;
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
        .then((response) =>  response.json())
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
            //console.log("we are in the getPDF")
           this.getPDF(responseText["response"]);
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

 getPDF(res){

  const binaryString = window.atob(res);
  const bytes = new Uint8Array(binaryString.length);
  const mappedData = bytes.map((byte, i) => binaryString.charCodeAt(i));
  const blob = new Blob([mappedData], { type: 'application/pdf' });
    console.log("here is the response")
    console.log(res);
    console.log(blob);
   const filename =  "check";
   
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.setAttribute("download", filename);
    a.text = "Download Me ";
    this.shadowRoot.getElementById('content').innerHTML ="";
    this.shadowRoot.getElementById('content').append(a);

}

    renderImage(image){
      console.log("we are in the renderImage function")
      this.shadowRoot.getElementById('content').innerHTML = '<img width= 50% height= auto src="data:image/jpg;base64,'+image+'"></img>';
    }
   

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
  .placeholder{
    padding:8px;
    width: fit-content; 
  /* To adjust the height as well */ 
  height: fit-content;
  }
      `;
    }
}
customElements.define('render-component', RenderComponent);
