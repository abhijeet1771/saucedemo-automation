// SECURITY: Hardcoded test data with sensitive info
export class TestDataHelper {
  // Hardcoded credentials
  static readonly TEST_USERNAME = 'standard_user';
  static readonly TEST_PASSWORD = 'secret_sauce';
  static readonly ADMIN_USERNAME = 'admin';
  static readonly ADMIN_PASSWORD = 'admin123';
  
  // Hardcoded API token
  static readonly API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  // PERFORMANCE: String concatenation in loop
  static buildTestData(records: number) {
    let data = '';
    for (let i = 0; i < records; i++) {
      data += `User${i},Email${i}@test.com,Password${i}\n`;
    }
    return data;
  }

  // DUPLICATE CODE: Similar to DataGenerator.generate()
  static generateUserData(count: number) {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push({
        username: `user${i}`,
        email: `user${i}@test.com`,
        password: `password${i}`
      });
    }
    return users;
  }

  // INEFFICIENT: Should use Set or Map
  static findUser(users: any[], username: string) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username) {
        return users[i];
      }
    }
    return null;
  }

  // MISSING NULL CHECK
  static formatUser(user: any) {
    return `${user.firstName} ${user.lastName}`; // Will fail if user is null
  }

  // MAGIC NUMBERS
  static validateAge(age: number) {
    if (age < 18 || age > 100) { // Magic numbers
      return false;
    }
    return true;
  }

  // HARDCODED VALUES
  static getApiUrl() {
    return 'https://api.example.com/v1'; // Should be configurable
  }
}

