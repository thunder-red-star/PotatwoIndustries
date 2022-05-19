module.exports = async function(message, argTemplate) {
  // Function to parse arguments in Discord messages
  /* Example args message input: say hello */
  // First argument is the command, so ignore it
  /* Example argTemplate input:
    [
      {
        name: 'message',
        description: 'The message to be said',
        type: 'string',
        required: true
      }
    ]
  */
  // Return an object with the parsed arguments
  // If the argument is not found, return null
  // If the argument is found but is not the correct type, return null
  // If the argument is found and is the correct type, return the value
  /* Example return object:
    {
      message: 'hello'
    }
  */
  // Possible types: string, number, boolean, user, channel, role
  // Notes: user can be parsed as a snowflake, mention, or username#discriminator
  // channel can be parsed as a snowflake or mention
  // role can be parsed as a snowflake or mention
  // boolean can be parsed as true or false
  // number can be parsed as a number
  // string can be parsed as a string

  // Split the arguments into an array
  let argsArray = message.content.split(" ").slice(1);

  // Create an object to store the parsed arguments
  let parsedArgs = {};

  // Loop through the argTemplate
  for (let i = 0; i < argTemplate.length; i++) {
    // Get the current argument
    let arg = argTemplate[i];

    // Get the current argument name
    let argName = arg.name;

    // Get the current argument type
    let argType = arg.type;

    // Get the current argument required status
    let argRequired = arg.required;

    // Get the current argument default value
    let argDefault = arg.default;

    // Get the current argument value
    let argValue = null;

    // Check if the current argument is required
    if (argRequired && argsArray.length <= i) {
      // The current argument is required, but it was not found
      // Return null
      argValue = null;
    } else if (argsArray.length <= i) {
      // The current argument is not required, but it was not found
      // Set the current argument value to the default value
      argValue = argDefault;
    } else {
      // The current argument was found
      // Set the current argument value to the found value

      // If the argument is the last argument in the template, join the remaining arguments with spaces
      if (i === argTemplate.length - 1) {
        argValue = argsArray.slice(i).join(" ");
      } else {
        argValue = argsArray[i];
      }
    }

    // Check if the current argument is the correct type
    // Check number
    if (argType === "number") {
      // The current argument is a number
      // Check if the current argument value is a number
      if (isNaN(argValue)) {
        // The current argument value is not a number
        // Return null
        argValue = null;
      } else {
        // The current argument value is a number
        // Set the current argument value to the parsed number
        argValue = parseInt(argValue);
      }
    } else if (argType === "boolean") {
      // The current argument is a boolean
      // Check if the current argument value is true or false
      if (argValue === "true") {
        // The current argument value is true
        // Set the current argument value to true
        argValue = true;
      } else if (argValue === "false") {
        // The current argument value is false
        // Set the current argument value to false
        argValue = false;
      } else {
        // The current argument value is not true or false
        // Return null
        argValue = null;
      }
    } else if (argType === "user") {
      console.log(argValue);
      console.log(argValue.length);
      // The current argument is a user
      // Check if the current argument value is a snowflake, mention, or username#discriminator
      if (argValue === null || argValue === undefined) {
        // The current argument value is not a snowflake, mention, or username#discriminator
        // Return null
        argValue = null;
      } else if (argValue.match(/^<@!?(\d+)>$/)) {
        if (argValue.startsWith("<@") && argValue.endsWith(">")) {
          // The current argument value is a snowflake, mention, or username#discriminator
          // Check if the current argument value is a snowflake
          if (argValue.startsWith("<@!")) {
            // The current argument value is a snowflake
            // Set the current argument value to the parsed snowflake
            argValue = await message.client.users.fetch(argValue.slice(3, argValue.length - 1));
          } else {
            // The current argument value is a mention
            // Set the current argument value to the parsed snowflake
            argValue = await message.client.users.fetch(argValue.slice(2, argValue.length - 1));
          }
        } else {
          // The value is not a mention
          argValue = null;
        }
      } else {
        if (argValue.includes("#")) {
          // The current argument value is a username#discriminator
          // Split the current argument value into an array
          let argValueArray = argValue.split("#");
          console.log(argValueArray);
          // Check if the current argument value is a username
          if (argValueArray.length === 2) {
            // The current argument value is a username#discriminator
            // Set the current argument value to the parsed username#discriminator
            argValue = message.client.users.cache.find(user => user.username === argValueArray[0] && user.discriminator === argValueArray[1]);
          } else {
            // The current argument value is not a username#discriminator
            // Return null
            argValue = null;
          }
        } else {
            // If the argument is 18 characters long and contains only numbers, it is a snowflake
            if (argValue.length === 18 && argValue.match(/^\d+$/)) {
                // The current argument value is a snowflake
                // Set the current argument value to the parsed snowflake
                argValue = await message.client.users.fetch(argValue);
            } else {
              // Try to find a user with the current argument value as a username
                argValue = message.client.users.cache.find(user => user.username === argValue);
            }
        }
      }
    } else if (argType === "channel") {
      // The current argument is a channel
      // Check if the current argument value is a snowflake, mention, or name
      if (argValue.startsWith("<#") && argValue.endsWith(">")) {
        // The current argument value is a snowflake, mention, or name
        // Check if the current argument value is a snowflake
        if (argValue.startsWith("<#!")) {
          // The current argument value is a snowflake
          // Set the current argument value to the parsed snowflake
          argValue = await message.client.channels.fetch(argValue.slice(3, argValue.length - 1));
        } else {
          // The current argument value is a mention
          // Set the current argument value to the parsed snowflake
          argValue = await message.client.channels.fetch(argValue.slice(2, argValue.length - 1));
        }
      } else {
        // The current argument value is not a snowflake, mention, or name
        // Check if the current argument value is a name
        if (argValue.length > 0) {
          // The current argument value is a name
          // Set the current argument value to the parsed name
          argValue = argValue;
        } else {
          // The current argument value is not a name
          // Return null
          argValue = null;
        }
      }
    } else if (argType === "role") {
      // The current argument is a role
      // Check if the current argument value is a snowflake, mention, or name
      if (argValue.startsWith("<@&") && argValue.endsWith(">")) {
        // The current argument value is a snowflake, mention, or name
        // Check if the current argument value is a snowflake
        if (argValue.startsWith("<@&!")) {
          // The current argument value is a snowflake
          // Set the current argument value to the parsed snowflake
          argValue = await message.client.roles.fetch(argValue.slice(3, argValue.length - 1));
        } else {
          // The current argument value is a mention
          // Set the current argument value to the parsed snowflake
          argValue = await message.client.roles.fetch(argValue.slice(2, argValue.length - 1));
        }
      } else {
        // The current argument value is not a snowflake, mention, or name
        // Check if the current argument value is a name
        if (argValue.length > 0) {
          // The current argument value is a name
          // Set the current argument value to the parsed name
          argValue = argValue;
        } else {
          // The current argument value is not a name
          // Return null
          argValue = null;
        }
      }
    } else {
      // Argument is parsed as a string
      // Set the current argument value to the parsed string
      argValue = argValue;
    }

    // Add the current argument value to the parsed arguments
    parsedArgs[argName] = argValue;
  }
  ;

// Return the parsed arguments
  return parsedArgs;
}
;