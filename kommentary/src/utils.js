import fs from 'fs'

export const queryLogWriter = function (response) {
    const queryLog = 'query_logs/querylogs.json';

    fs.access(queryLog, fs.constants.F_OK, (findError) => {
        if (findError) {
            fs.writeFile(queryLog, JSON.stringify(response), (writeError) => {
                if (writeError) {
                    console.error('Error writing to file:', writeError);
                    return;
                }
                console.log('Query was written to queryLog');
            });
        } else {
            fs.writeFile(queryLog, JSON.stringify(response), (writeError) => {
                if (writeError) {
                    console.error('Error writing to file:', writeError);
                    return;
                }
                console.log('Query was written to queryLog');
            });
        }
    });
};