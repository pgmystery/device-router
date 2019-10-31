/// <reference types="Cypress" />

// Cypress.Commands.add('login', () => {
//   cy.request({
//     method: 'POST',
//     url: 'http://localhost:5000/api/session',
//     body: {
//       username: 'test',
//       password: 'test123',
//     }
//   })
//     .its('body')
//     .then(body => {
//       console.log(body)
//     })
// })



context('LandingPage', () => {
  beforeEach(() => {
    cy.clearCookies()
    Cypress.Cookies.preserveOnce('sid')
    cy.visit('http://localhost:3000/dashboard')
    // cy.login()
  })



  it('has the right App title', () => {
    cy.title().should('contain', 'Device-Router')
  })

  it('has a login-form', () => {
    cy.get('label').should('have.length', 2)
    cy.get('input').should('have.length', 2)
    cy.get('button').should('have.length', 1)
    cy.get('a').should('have.length', 1)
    cy.get('label').contains('Username:')
    cy.get('label').contains('Password:')
    cy.get('input').should('have.length', 2)
  })

  it('check the login', () => {
    cy
      .get('label')
      .contains('Username')
      .find('input')
      .type('test')
    cy
      .get('label')
      .contains('Password')
      .find('input')
      .type('test123')
    cy
      .get('button')
      .contains('Login')
      .click()
    cy.wait(300)
  })


  it('has a nav', () => {
    cy
      .get('nav')
      .find('a')
      .length(4)
      // .each(el => {
      //   // el.contains('Dashboard')
      // })
      
      // .contains('Registerlist')
  })
})


