# Testing Coverage

For each force, we test:
- Constructor and intialization
- Error cases and validation
- Force calculations
- Force application
- Property updates
- Edge cases
- Multipl body interactions

Physics-Specified Testing Considerations:
- Testing vector operations
- Verifying force magnitudes and directions
- Checking conservaition laws (equal and opposite forces)
- Testing torque geneartion
- Verifying spring properties (compression/extension)

# Running Test Files

```bash
npm test --GravityForce # Run only GravityForce tests
npm run test:watch      # Watch mode
npm run test:coverage   # Generate coverage report
```