# Running
1. Run [chrome.bat](chrome.bat).
2. First time only: open [https://beta.openai.com/playground](https://beta.openai.com/playground) and login.
3. Run in different shell:
```shell 
java -jar selenium.jar standalone
```
# Configuration
* for using the first/second format, call the load data function(called in the bthread "train", in NLP.story.js) with 1/2 accordingly.
    - the first format is the default.
<br/><br/>

### Two Formats of data files are allowed:

1. ****_Recommended_**** (newly added). Receives a file containing both train data and test, in any order.
An example of such file is [here](src/main/resources/train/Store/store_entities_behaviors_updated.js).
Train data is given in the following format:
```js
    //region
    //Requirement: <the prompt of the requirement>
    //Output:
     <the code which satisfies the requirement>    
    //endregion
```
Test data is given in the following format(No region):
```js
    //Requirement: <the prompt of the requirement>
    //Output:
     <the code which satisfies the requirement>
```
* in future versions, the output is going to be optional(for test data), however, we advise to use it as in the future it will be used for evaluation.
2. Receives Two files, a file containing only train data, in the following format:
```js
    /*<the prompt of the requirement>*/
     <the code which satisfies the requirement>
```
And a file containing only test data, in the following format:
```js
    /*<the prompt of the requirement>*/
```
