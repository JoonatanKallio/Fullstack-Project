/* eslint-disable no-undef */
describe('Test homepage', () => {
  it('Visits the homepage', () => {
    cy.visit('http://localhost:3000/')
    cy.contains("Current posts")

  })
})

describe('Test register username lenght', () => {
  it('Visits the register page', () => {
    cy.visit('http://localhost:3000/')
    cy.contains("Register").click()
    cy.url().should("include", "/register")
    cy.get(".register-email").type("test@emai.com")
    cy.get(".register-username").type("no")
    cy.get(".register-password").type("Testp4ssword#")
    cy.get("#register-submit").click()
    cy.contains("Username must be 3 characters long.")
  })
})

describe('Test register email', () => {
  it('Visits the register page', () => {
    cy.visit('http://localhost:3000/')
    cy.contains("Register").click()
    cy.url().should("include", "/register")
    cy.get(".register-email").type("testemail.com")
    cy.get(".register-username").type("yes")
    cy.get(".register-password").type("Testp4ssword#")
    cy.get("#register-submit").click()
    cy.contains("Not an email")
  })
})



describe('Test password rules', () => {
  it('Visits the register page and tests good password rules', () => {
    cy.visit('http://localhost:3000/')
    cy.contains("Register").click()
    cy.url().should("include", "/register")
    cy.get(".register-email").type("test@email.com")
    cy.get(".register-username").type("yes")
    cy.get(".register-password").type("test")
    cy.get("#register-submit").click()
    cy.contains("Password is not strong enough. (8 characters, 1 upper and lowercase, 1 number and 1 special character)")
    cy.get(".register-password").type("Pass")
    cy.get("#register-submit").click()
    cy.contains("Password is not strong enough. (8 characters, 1 upper and lowercase, 1 number and 1 special character)")
    cy.get(".register-password").type("4")
    cy.get("#register-submit").click()
    cy.contains("Password is not strong enough. (8 characters, 1 upper and lowercase, 1 number and 1 special character)") 
    cy.get('.register-password').clear();
    cy.get(".register-password").type("Password#")
    cy.get("#register-submit").click()
    cy.contains("Password is not strong enough. (8 characters, 1 upper and lowercase, 1 number and 1 special character)")
    cy.get(".register-password").type("3")
    cy.get("#register-submit").click()
    cy.contains("Login here")
    cy.url().should("include", "/login")
  })
})

describe('Test login page', () => {
  it('Visits the login page and logs in', () => {
    cy.visit('http://localhost:3000/')
    cy.contains("Login").click()
    cy.url().should("include", "/login")
    cy.get(".login-email").type("test@email.com")
    cy.get(".login-password").type("Password#3")
    cy.get(".login-button").click()
    cy.contains("Logout")
    cy.contains("Profile")
    cy.url().should("include", "/")
  })
})

describe('Test post', () => {
  it('Logs in and creates a post', () => {
    cy.visit('http://localhost:3000/')
    cy.contains("Login").click()
    cy.url().should("include", "/login")
    cy.get(".login-email").type("test@email.com")
    cy.get(".login-password").type("Password#3")
    cy.get(".login-button").click()
    cy.contains("Logout")
    cy.contains("Profile")
    cy.contains("Create a post").click()
    cy.url().should("include", "/post/create")
    cy.get(".post-title-text").type("Title")
    cy.get(".public-DraftStyleDefault-block").type("content content")
    cy.get(".submit-post").click()
    cy.contains("Title | @yes")
  })
})

describe('Test commenting', () => {
  it('Logs in and creates comment', () => {
    cy.visit('http://localhost:3000/')
    cy.contains("Login").click()
    cy.url().should("include", "/login")
    cy.get(".login-email").type("test@email.com")
    cy.get(".login-password").type("Password#3")
    cy.get(".login-button").click()
    cy.contains("Logout")
    cy.contains("Profile")
    cy.url().should("include", "/")
    cy.contains("Title | @yes").click()
    cy.get(".comment-text").type("Test comment")
    cy.get(".comment-submit").click()
    cy.contains("Test comment @yes")
  })
})

describe('Test post editing', () => {
  it('Logs in and tests editing the post earlier test', () => {
    //Login
    cy.visit('http://localhost:3000/')
    cy.contains("Login").click()
    cy.url().should("include", "/login")
    cy.get(".login-email").type("test@email.com")
    cy.get(".login-password").type("Password#3")
    cy.get(".login-button").click()
    cy.contains("Logout")
    cy.contains("Profile")
    cy.url().should("include", "/")
    cy.contains("Title | @yes").click()
    cy.get(".edit-post").click()
    cy.url().should("include", "/post/edit/")
    cy.get(".public-DraftStyleDefault-block").type("Test edit")
    cy.get(".save-post-edit").click()
    cy.url().should("include", "/post")
    cy.contains("Test edit")
  })
})

describe('Test comment editing', () => {
  it('Logs in and tests editing the comment earlier test', () => {
    //Login
    cy.visit('http://localhost:3000/')
    cy.contains("Login").click()
    cy.url().should("include", "/login")
    cy.get(".login-email").type("test@email.com")
    cy.get(".login-password").type("Password#3")
    cy.get(".login-button").click()
    cy.contains("Logout")
    cy.contains("Profile")
    cy.url().should("include", "/")
    cy.contains("Title | @yes").click()
    cy.get(".edit-comment").click()
    cy.url().should("include", "/comment/edit/")
    cy.get(".comment-editing-box").type("Test comment edit")
    cy.get(".save-comment-edit").click()
    cy.url().should("include", "/post")
    cy.contains("Test comment edit")
  })
})


describe('Route test', () => {
  it('Tests a route that is not defined', () => {
    cy.visit('http://localhost:3000/notfound123')
    cy.contains("404: Page not found").click()
  })
})
