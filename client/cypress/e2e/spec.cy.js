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
  it('Visits the register page', () => {
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
  it('Visits the login page', () => {
    cy.visit('http://localhost:3000/')
    cy.contains("Login").click()
    cy.url().should("include", "/login")
    cy.get(".login-email").type("test@email.com")
    cy.get(".login-password").type("Password#3")
    cy.get(".login-button").click()
    cy.contains("Logout")
    cy.contains("Logged in as yes")
    cy.url().should("include", "/")
  })
})

describe('Test post', () => {
  it('Visits the login page', () => {
    cy.visit('http://localhost:3000/')
    cy.contains("Login").click()
    cy.url().should("include", "/login")
    cy.get(".login-email").type("test@email.com")
    cy.get(".login-password").type("Password#3")
    cy.get(".login-button").click()
    cy.contains("Logout")
    cy.contains("Logged in as yes")
    cy.url().should("include", "/")

    cy.get(".post-title-text").type("Title")
    cy.get(".public-DraftStyleDefault-block").type("content content")
    cy.get(".submit-post").click()
    cy.contains("Title | @yes")
  })
})


