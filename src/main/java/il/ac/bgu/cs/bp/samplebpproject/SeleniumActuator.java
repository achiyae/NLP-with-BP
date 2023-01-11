package il.ac.bgu.cs.bp.samplebpproject;

import il.ac.bgu.cs.bp.bpjs.execution.listeners.BProgramRunnerListenerAdapter;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import org.apache.commons.exec.OS;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.util.Map;

public class SeleniumActuator extends BProgramRunnerListenerAdapter {
  private WebDriver driver;

  private void connect() {
    ChromeOptions options = new ChromeOptions();
    options.setExperimentalOption("debuggerAddress", "127.0.0.1:4444");
    driver = new ChromeDriver(options);
  }

  private WebElement getElement(final String xpath) {
    //new WebDriverWait(driver, 15).until(ExpectedConditions.elementToBeClickable(By.xpath(xpath)));
    return driver.findElement(By.xpath(xpath));
  }

  private void click(String xpath) {
    getElement(xpath).click();
  }

  private void writeText(String xpath, String text, boolean clearBeforeWrite) {
    WebElement element = getElement(xpath);
    if (clearBeforeWrite) {
      if (OS.isFamilyMac()) {
        element.sendKeys(Keys.chord(Keys.COMMAND, "a", Keys.DELETE));
      } else {
        element.sendKeys(Keys.chord(Keys.CONTROL, "a", Keys.DELETE));
      }
    }
    element.sendKeys(text);
  }

  @Override
  public void eventSelected(BProgram bp, BEvent e) {
    if (!e.name.equals("Selenium")) return;
    var data = (Map<String, Object>) e.maybeData;
    var action = (String) data.get("type");
    var xpath = (String) data.get("xpath");
    var actionData = data.get("data");
    switch (action) {
      case "startSession":
        connect();
        break;
      case "writeText":
        writeText(xpath, actionData.toString(), false);
        break;
      case "click":

      default:
        throw new RuntimeException("Unsupported action");
    }
  }
}
