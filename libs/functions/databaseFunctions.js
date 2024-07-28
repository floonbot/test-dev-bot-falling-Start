const { promises: fsPromises } = require("fs");
const { resolve } = require("path");

const DATABASE = process.env.DATABASE;

async function getTablesWithColumns(db, tablesLoaded, indent = 0) {
  try {
    const [tables] = await db.query("SHOW TABLES");
    for (const table of tables) {
      const tableName = table[`Tables_in_${DATABASE}`];
      console.log(
        `${global.colors.text_light_blue}[${"".repeat(
          indent
        )}[Table] => ${tableName}`
      );
      tablesLoaded.push(tableName);

      try {
        const columns = await getColumns(db, tableName, indent + 1);
        for (const column of columns) {
          console.log(
            `${global.colors.text_light_gray}[${"".repeat(
              indent + 1
            )}[Colonne] ${column.Field}`
          );
        }
      } catch (columnError) {
        await handleColumnError(tableName, columnError);
      }
    }
    return tablesLoaded;
  } catch (err) {
    throw err;
  }
}

async function getColumns(db, tableName, indent = 0) {
  try {
    const [columns] = await db.query(`SHOW COLUMNS FROM ${tableName}`);
    return columns;
  } catch (err) {
    throw err;
  }
}

async function handleColumnError(tableName, error) {
  const errorDir = resolve("./libs/errors/databases");
  const currentDate = new Date()
    .toLocaleString("en-US", { timeZone: "UTC" })
    .replace(/[\/:]/g, "-");
  const errorFilePath = resolve(
    `${errorDir}/${tableName}_columns_error_${currentDate}.txt`
  );

  await fsPromises.mkdir(errorDir, { recursive: true });

  await fsPromises.writeFile(
    errorFilePath,
    `Error loading columns for table ${tableName}: ${error.stack}`,
    "utf-8"
  );
  console.log(
    `${global.colors.text_light_red}[[columns] =>`,
    `Columns for table ${tableName} not loaded`
  );
  console.error(
    `${global.colors.text_light_green.bold}[columns] =>`,
    `Error loading columns for table ${tableName}. An error file has been created with the details: ${errorFilePath}`
  );
}

module.exports = {
  getTablesWithColumns,
  getColumns,
  handleColumnError,
};
