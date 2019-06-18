// Business Logic for AddressBook ----------------------------------------------
function AddressBook() {
  this.contacts = [],
  this.currentId = 0
}

AddressBook.prototype.addContact = function(contact) {
  contact.id = this.assignId();
  this.contacts.push(contact);
}

AddressBook.prototype.assignId = function() {
  this.currentId += 1;
  return this.currentId;
}

AddressBook.prototype.findContact = function(id) {
  for (var i=0; i< this.contacts.length; i++) {
    if (this.contacts[i]) {
      if (this.contacts[i].id == id) {
        return this.contacts[i];
      }
    }
  };
  return false;
}

AddressBook.prototype.deleteContact = function(id) {
  for (var i=0; i< this.contacts.length; i++) {
    if (this.contacts[i]) {
      if (this.contacts[i].id == id) {
        delete this.contacts[i];
        return true;
      }
    }
  };
  return false;
}

// Business Logic for Contacts -------------------------------------------------
function Contact(firstName, lastName, phoneNumber, email) {
  this.firstName = firstName,
  this.lastName = lastName,
  this.phoneNumber = phoneNumber,
  this.email = email,
  this.addresses = []
}

Contact.prototype.fullName = function() {
  return this.firstName + " " + this.lastName;
}

Contact.prototype.addAddress = function(address) {
  this.addresses.push(address);
}

// Business Logic for Addresses ------------------------------------------------
function Address(street, /*city, state, zipcode,*/ type) {
  this.street = street,
  // this.city = city,
  // this.state = state,
  // this.zipcode = zipcode,
  this.type = type
}


// User Interface Logic --------------------------------------------------------
var addressBook = new AddressBook();
var numberOfAddressFields = 1;

// -- Utility Functions --
function attachContactListeners() {
  $("ul#contacts").on("click", "li", function() {
    showContact(this.id);
  });
  $("#buttons").on("click", ".deleteButton", function() {
  addressBook.deleteContact(this.id);
  $("#show-contact").hide();
  displayContactDetails(addressBook);
});
};

function displayContactDetails(addressBookToDisplay) {
  var contactsList = $("ul#contacts");
  var htmlForContactInfo = "";
  addressBookToDisplay.contacts.forEach(function(contact) {
    htmlForContactInfo += "<li id=" + contact.id + ">" + contact.firstName + " " + contact.lastName + "</li>";
  });
  contactsList.html(htmlForContactInfo);
};

function showContact(contactId) {
  var contact = addressBook.findContact(contactId);
  $("#show-contact").show();
  $(".first-name").html(contact.firstName);
  $(".last-name").html(contact.lastName);
  $(".phone-number").html(contact.phoneNumber);
  $(".email").html(contact.email);
  $(".street").html(contact.addresses[0].street);
  $(".type").html(contact.addresses[0].type);
  var buttons = $("#buttons");
  buttons.empty();
  buttons.append("<button class='deleteButton' id=" +  + contact.id + ">Delete</button>");
  $(".moreAddressResults").empty();
  for (var i = 1; i< contact.addresses.length; i++){
    $(".moreAddressResults").append(`<p>Address ${i+1}: ${contact.addresses[i].street}</p><p>Type: ${contact.addresses[i].type}</p>`);
  }
}

// -- Document Ready Function --
$(document).ready(function() {
  attachContactListeners();

  $("form#new-contact").submit(function(event) {
    event.preventDefault();
    var inputtedFirstName = $("input#new-first-name").val();
    var inputtedLastName = $("input#new-last-name").val();
    var inputtedPhoneNumber = $("input#new-phone-number").val();
    var inputtedEmail = $("input#new-email").val();
    var inputtedStreet = $("input#new-street").val();
    var inputtedType = $("input#new-type").val();
    var moreAddresses = []
    for(var num = 2; num <= numberOfAddressFields; num++) {
      var inStreet = $("input#new-street" + num).val();
      var inType = $("input#new-type" + num).val();
      moreAddresses.push(new Address (inStreet, inType))
    }

    $("input#new-first-name").val("");
    $("input#new-last-name").val("");
    $("input#new-phone-number").val("");
    $("input#new-email").val("");
    $("input#new-street").val("");
    $("input#new-type").val("");
    $("#moreAddresses").empty();

    var newContact = new Contact(inputtedFirstName, inputtedLastName, inputtedPhoneNumber, inputtedEmail);
    var newAddress = new Address(inputtedStreet, inputtedType)
    newContact.addAddress(newAddress);
    moreAddresses.forEach(function(extraAddress){
      newContact.addAddress(extraAddress)
    })
    addressBook.addContact(newContact);
    displayContactDetails(addressBook);
    console.log(addressBook.contacts);
  })

  $("button#add-address").click(function(){
    numberOfAddressFields++;
    $("#moreAddresses").append(`
      <div class="row">
        <input type="text" class="form-control col-sm-4" id="new-street${numberOfAddressFields}" placeholder="Street">
        <input type="text" class="form-control col-sm-4" id="new-type${numberOfAddressFields}" placeholder="Type">
      </div>
    `);
  });
})
