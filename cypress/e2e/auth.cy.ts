```typescript
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('allows users to sign in', () => {
    cy.get('button').contains('Sign In').click();
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('TestPass123!');
    cy.get('button[type="submit"]').click();
    
    cy.get('button').contains('Sign Out').should('exist');
  });

  it('shows validation errors for invalid inputs', () => {
    cy.get('button').contains('Sign In').click();
    cy.get('button[type="submit"]').click();
    
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('allows users to sign out', () => {
    cy.login('test@example.com', 'TestPass123!');
    cy.get('button').contains('Sign Out').click();
    cy.get('button').contains('Sign In').should('exist');
  });
});
```