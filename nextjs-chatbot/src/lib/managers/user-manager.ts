import { SQLManager } from '@/lib/managers/sql-manager';

export interface UserInfo {
  id?: number;
  name?: string;
  last_name?: string;
  occupation?: string;
  location?: string;
  gender?: string;
  age?: number;
  interests?: string;
}

export class UserManager {
  private sqlManager: SQLManager;
  public userInfo: UserInfo | null;
  public userId: number | null;

  constructor(sqlManager: SQLManager) {
    this.sqlManager = sqlManager;
    this.userInfo = null;
    this.userId = null;
  }

  async initialize(): Promise<void> {
    this.userInfo = await this.getUserInfo();
    this.userId = await this.getUserId();
  }

  async getUserInfo(): Promise<UserInfo | null> {
    const query = "SELECT * FROM user_info LIMIT 1;";
    const user = await this.sqlManager.executeQuery<any>(query, [], true);
    
    if (user) {
      const userInfo: UserInfo = {
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        occupation: user.occupation,
        location: user.location,
        gender: user.gender,
        age: user.age,
        interests: user.interests
      };
      
      // Filter out null, undefined, empty strings, and NaN values
      const filteredUserInfo: UserInfo = {};
      Object.entries(userInfo).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "" && 
            !(typeof value === 'number' && isNaN(value))) {
          (filteredUserInfo as any)[key] = value;
        }
      });
      
      return filteredUserInfo;
    }
    return null;
  }

  async refreshUserInfo(): Promise<void> {
    this.userInfo = await this.getUserInfo();
  }

  async getUserId(): Promise<number | null> {
    const query = "SELECT id FROM user_info LIMIT 1;";
    const user = await this.sqlManager.executeQuery<any>(query, [], true);
    return user ? user.id : null;
  }

  async addUserInfoToDatabase(userInfo: Record<string, any>): Promise<[string, string]> {
    console.log("Entering the add user info function");
    console.log("user_info:", userInfo);
    console.log(typeof userInfo);
    
    try {
      const validKeys = new Set(["name", "last_name", "age", "gender", "location", "occupation", "interests"]);

      for (const key of Object.keys(userInfo)) {
        if (!validKeys.has(key)) {
          return ["Function call failed.", "Please provide a valid key from the following list: name, last_name, age, gender, location, occupation, interests"];
        }
      }

      const processedInfo = { ...userInfo };

      // Handle merging interests if present
      if ("interests" in processedInfo) {
        let newInterests: string[] = [];
        if (Array.isArray(processedInfo.interests)) {
          newInterests = processedInfo.interests.filter(i => typeof i === 'string').map(i => i.trim());
        } else if (typeof processedInfo.interests === 'string') {
          newInterests = processedInfo.interests.split(',').map(i => i.trim());
        }

        const query = "SELECT interests FROM user_info LIMIT 1;";
        const result = await this.sqlManager.executeQuery<any>(query, [], false, true);
        let existingInterests: string[] = [];
        if (result && Array.isArray(result) && result.length > 0 && result[0].interests) {
          existingInterests = result[0].interests.split(",").map((i: string) => i.trim()).filter((i: string) => i);
        }

        const mergedInterests = Array.from(new Set([...existingInterests, ...newInterests])).sort();
        processedInfo.interests = mergedInterests.join(", ");
      }

      // Prepare SQL SET clause
      const keys = Object.keys(processedInfo);
      const setClause = keys.map(key => `${key} = ?`).join(", ");
      const params = Object.values(processedInfo);

      if (!setClause) {
        return ["Function call failed.", "No valid fields to update."];
      }

      const updateQuery = `
        UPDATE user_info
        SET ${setClause}
        WHERE id = (SELECT id FROM user_info LIMIT 1);
      `;

      await this.sqlManager.executeQuery(updateQuery, params);
      return ["Function call successful.", "User information updated."];
    } catch (error) {
      console.error("Error:", error);
      return ["Function call failed.", `Error: ${error}`];
    }
  }
}