// Business Logic for AddressBook --------

function AddressBook () {
  this.contacts =  {};
  this.currentId = 0;
}

AddressBook.prototype.addContact = function(contact) {
  contact.id = this.assignId();
  this.contacts[contact.id] = contact;
}

AddressBook.prototype.assignId = function() {
  this.currentId += 1;
  return this.currentId;
}

AddressBook.prototype.findContact = function(id) {
  if (this.contacts[id] != undefined) {
    return this.contacts[id];
  }
  return false;
}

AddressBook.prototype.deleteContact = function(id) {
  if (this.contacts[id] === undefined) {
    return false;
  }
  delete this.contacts[id];
  return true;
}

// Business Logic for Contacts -------
function Contact(firstName, lastName, phoneNumber) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.phoneNumber = phoneNumber;
}

Contact.prototype.fullName = function () {
  return this.firstName + " " + this.lastName;
}

// User Interface Logic -------

let addressBook = new AddressBook(); //this is a global variable as it is mimicking a database which needs to be globally scoped

function attachContactListeners() {
  $("ul#contacts").on("click", "li", function() {
    showContact(this.id); //this refers the li in the on() method. The li will always correspond to the actual ID of the contact because our displayContactDetails() function establishes the following: "<li id=" + contact.id + ">"
  });
  $("#buttons").on("click", ".deleteButton", function() {
    addressBook.deleteContact(this.id); //this refers the .deleteButton in the on() method. .deleteButton is dynamically created in showContact();
    $("#show-contact").hide();
    displayContactDetails(addressBook);
  });
};

function showContact(contactId) {
  const contact = addressBook.findContact(contactId);
  $("#show-contact").show();
  $(".first-name").html(contact.firstName);
  $(".last-name").html(contact.lastName);
  $(".phone-number").html(contact.phoneNumber);
  let buttons = $("#buttons");
  buttons.empty();
  buttons.append("<button class='deleteButton' id=" + contact.id + ">Delete</button>");
}

//Refactor opportunity in showContact(): Note that we aren't being incredibly efficient here - three queries to the DOM with the jQuery's html() method. If you wish, you can refactor this code later to make only one query. To do so, you simply need to remove the HTML from index.html and construct it in this method instead.

function displayContactDetails(addressBookToDisplay) {
  let contactsList = $("ul#contacts");
  let htmlForContactInfo = "";
  Object.keys(addressBookToDisplay.contacts).forEach(function(key) {
    const contact = addressBookToDisplay.findContact(key);
    htmlForContactInfo += "<li id=" + contact.id + ">" + contact.firstName + " " + contact.lastName + "</li>";
  });
  contactsList.html(htmlForContactInfo);
};

$(document).ready(function() {
  attachContactListeners();
  $("form#new-contact").submit(function(event) {
    event.preventDefault();
    const inputtedFirstName = $("input#new-first-name").val();
    const inputtedLastName = $("input#new-last-name").val();
    const inputtedPhoneNumber = $("input#new-phone-number").val();
    let newContact = new Contact(inputtedFirstName, inputtedLastName, inputtedPhoneNumber);
    addressBook.addContact(newContact);
    displayContactDetails(addressBook);
  })
})