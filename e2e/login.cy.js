// describe("login functionality", ()=>{

//     it("valid login",()=>{
//         cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
//     })
// })
// Import the Faker library
const { faker } = require('@faker-js/faker');


describe('My test cases orangeHRM', () => {

  function generateRandomPassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
  it('login as admin', () => {
    cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    const adminUserName = "Admin"
    const adminPassword = "admin123"
    cy.get("input[name='username'").type(adminUserName)
    cy.get("input[name='password'").type(adminPassword)
    cy.get("[type='submit']").click()
    //
    
    cy.get('h6').should("have.text", "Dashboard")
    cy.get("span").contains("PIM").click()
    cy.get("button[type='button']").contains("Add").click()

    // create new employee
    
    // Extract the Employee ID.
    var employeeID = ""
    cy.get('label').contains("Employee Id").parent().siblings('div').find('input').invoke("val").then((value) => {
      employeeID = value
    }).then(() => {
      // Create a new employee using Faker
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();

      const fullName = firstName + " " + lastName
      // const employeeId = faker.datatype.uuid(); // Using UUID for a unique employee ID
      // cy.log("EmployeeID",employeeId)
      const username = firstName + lastName
      const password = generateRandomPassword()
      //Fill the employee form
      cy.get("input[name='firstName'").type(firstName)
      cy.get("input[name='lastName']").type(lastName)
      // Click On Create Login Details toggle
      cy.get("input[type='checkbox']").click({ force: true })
      // Fill the login details form...
      cy.get('label').contains("Username").parent().siblings('div').find('input').type(username)
      cy.get('label').contains("Password").parent().siblings('div').find('input').type(password)
      cy.get('label').contains("Confirm Password").parent().siblings('div').find('input').type(password)
      cy.get("button[type='submit']").click()
      // Assert the Employee Creation Notification Message
      cy.get('.oxd-text--toast-message').should("have.text", "Successfully Saved")
      
      cy.get('h6').should("contain.text", fullName)

      ////save employee info in a file
     
      
    
      cy.writeFile("cypress/fixtures/test.json", {
        username,
        password,
        employeeID
      });

      /// click employee list and search by id
      cy.get("li a").contains("Employee List").click()
      // cy.waitTillVisible('h6')
      cy.fixture('test').then((employee) => {
        cy.get('label').contains("Employee Id").parent().siblings('div').find('input').type(employee.employeeID)
        cy.get("button[type='submit']").click()
        //Assert the firstName of the Employee is showing.
        cy.get("div[role='cell'] div").contains(firstName).invoke('text')
          .then((text) => {
            const expectedText = text.replace(/\s+/g, ' ').trim(); // Collapse multiple spaces into one and trim
            expect(expectedText).to.eq(firstName);
          });
      })

      ////
      cy.get("span").contains("Directory").click()

      // Type the firstName in the Employee Name
      cy.get("input[placeholder='Type for hints...']").type(firstName)
      // Get the locator from the API response from the cypress execution snapshot
      cy.get('.oxd-autocomplete-option > span').click()
      // Click on Search
      cy.get("button[type='submit']").click()
      // Assert employee name after searching the employee in the Directory
      // Will fail due to extra spaces in the name, need to trim it.
      // cy.get(".orangehrm-directory-card-header").should("have.text",firstName + " " + lastName)

      cy.get(".orangehrm-directory-card-header")
        .invoke('text')
        .then((text) => {
          const normalizedText = text.replace(/\s+/g, ' ').trim(); // Collapse multiple spaces into one and trim
          expect(normalizedText).to.eq(fullName);
        });


      ///log out admin
      cy.get("span img").click()
      cy.get("li a").contains("Logout").click()
      ///////log in as new employee
      cy.fixture("test").then((employee) => {
        //Login as new employee
        cy.get("input[name='username'").type(employee.username)
        cy.get("input[name='password'").type(employee.password)
        cy.get("[type='submit']").click()
        // Assert that the Newly Created Employee Full Name is showing beside the profile icon.
        cy.get("p.oxd-userdropdown-name").should("have.text", fullName)
        // Navigate to My Info test111
        cy.get("span").contains("My Info").click()
        
        cy.scrollTo(0, 600); 
        // Click on the Male Gender Radio button
        cy.get("label").contains("Male").click()
        // Click on the blood type dropdown
        cy.get("label").contains("Blood Type").parent().siblings("div").click()
        // Select a blood Group
        cy.get('.oxd-select-dropdown > :nth-child(4)').click()
        cy.get("button[type='submit']").eq(1).click()
        // Assert the Employee Successfully Saved Message
        cy.get('.oxd-text--toast-message').should("have.text", "Successfully Saved")
      })

      //// log out as user

      // cy.get("span img").click()
      // cy.get("li a").contains("Logout").click()

      cy.get("span img").click()
      cy.get("li a").contains("Logout").click()






    }) //end of employee id

    //////////////
  })
})