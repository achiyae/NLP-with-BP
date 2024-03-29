# Running
1. Run [chrome.bat](chrome.bat).
2. It will open on [https://beta.openai.com/playground](https://beta.openai.com/playground), login to playground (if needed). No need to do anything there.
3. Run Main class (i.e., [Main](src/main/java/Main.java)). This can be done by running:
```bash
mvn exec:java
```

You can also create an uber-jar and run it:
```bash
mvn -P"uber-jar" clean package
java -jar .\target\SampleBPProject-0.6-DEV.uber.jar
```

# Configuration
* Set the project you wish to run (e.g., [src/main/resources/projects/Magento](src/main/resources/projects/Magento)).

# Project's file format
The project's directory may contain any number of js files. Each file has the following format:
1. It may contain both train data and test. The order between them may be mixed.
See the [Magento](src/main/resources/projects/Magento) project for example. 
2. The train data has the following format:
```js
    //region
    //Requirement: 
    /* <the prompt of the requirement> */
    //Output:
     <the code which satisfies the requirement>    
    //endregion
```
Test data is given in the following format (no region):
```js
    //Requirement: 
    /* <the prompt of the requirement> */
    //Output:
     <Optional: the code which satisfies the requirement.>
```
* While output is optional (for test data), we advise using it as in the future it may be used for evaluation.