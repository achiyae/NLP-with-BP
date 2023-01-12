package il.ac.bgu.cs.bp.samplebpproject;

import com.google.common.base.Strings;
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

import java.util.Map;

public class SeleniumActuator extends BProgramRunnerListenerAdapter {
  private WebDriver driver;
  private static final int SLEEP = 500;

  private void connect(String url) {
    ChromeOptions options = new ChromeOptions();
    options.setExperimentalOption("debuggerAddress", "127.0.0.1:9222");
    driver = new ChromeDriver(options);
    if(!Strings.isNullOrEmpty(url)) driver.get(url);
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
    int sleep = SLEEP;
    var data = (Map<String, Object>) e.maybeData;
    var action = (String) data.get("type");
    var xpath = (String) data.get("xpath");
    var actionData = data.get("data");
    switch (action) {
      case "startSession":
        connect(xpath);
        sleep = 2000;
        break;
      case "writeText":
        writeText(xpath, actionData.toString(), false);
        sleep = 2000;
        break;
      case "click":
        click(xpath);
        sleep = 2000;
        break;
      default:
        throw new RuntimeException("Unsupported action "+ action);
    }
    try {
      Thread.sleep(sleep);
    } catch (InterruptedException ex) {
      throw new RuntimeException(ex);
    }
  }
}
