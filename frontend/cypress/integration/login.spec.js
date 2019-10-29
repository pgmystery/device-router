/// <reference types="Cypress" />

  context('Login', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login')
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
    })
  })

