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
import org.openqa.selenium.chrome.ChromeDriverService;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.FluentWait;

import java.awt.*;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.StringSelection;
import java.time.Duration;
import java.util.Map;
import java.util.Random;
import java.util.function.Function;

import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;

public class SeleniumActuator extends BProgramRunnerListenerAdapter {
  private RemoteWebDriver driver;
  private static final int SLEEP = 500;

  private void connect(String url) {
    System.setProperty("webdriver.http.factory", "jdk-http-client");
    ChromeOptions options = new ChromeOptions();
    options.setExperimentalOption("debuggerAddress", "localhost:9222");
//    options.addArguments("--remote-allow-origins=*");
    options.addArguments("--remote-allow-origins=*","ignore-certificate-errors");
    driver = new ChromeDriver(options);
    if (!Strings.isNullOrEmpty(url)) driver.get(url);
  }

  private WebElement getElement(final String xpath) {
    //new WebDriverWait(driver, 15).until(ExpectedConditions.elementToBeClickable(By.xpath(xpath)));
    return driver.findElement(By.xpath(xpath));
  }

  private void startRecord(String xpath) {
  }

  private void click(String xpath) {
    getElement(xpath).click();
  }

  private void waitForVisibility(String xpath) {
    var wait = new FluentWait<>(driver);
    int timeoutInMillis = 60000;
    wait = wait.withTimeout(Duration.ofMillis(timeoutInMillis));
    wait.until((Function) visibilityOfElementLocated(By.xpath(xpath)));
  }

  private void clearText(WebElement element, boolean clearBeforeWrite) {
    if (clearBeforeWrite) {
      if (OS.isFamilyMac()) {
        element.sendKeys(Keys.chord(Keys.COMMAND, "a", Keys.DELETE));
      } else {
        element.sendKeys(Keys.chord(Keys.CONTROL, "a", Keys.DELETE));
      }
    }
  }

  private void pasteText(String xpath, String text, boolean clearBeforeWrite) {
    WebElement element = getElement(xpath);
    clearText(element, clearBeforeWrite);
    Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    clipboard.setContents(new StringSelection(text), null);
    element.sendKeys(Keys.CONTROL, "v");
  }

  private void writeText(String xpath, String text, int charByChar, boolean clearBeforeWrite) {
    WebElement element = getElement(xpath);
    clearText(element, clearBeforeWrite);
    var rand = new Random();
    var lines = text.lines().toArray(String[]::new);
    boolean indent = false;
    for (String s : lines) {
      var line = s + '\n';
      if (indent) {
        element.sendKeys(Keys.SHIFT, Keys.HOME);
        element.sendKeys(Keys.BACK_SPACE);
      }
      indent = line.charAt(0) == ' ';

      var chars = line.chars().toArray();
      for (int aChar : chars) {
        char c = (char) aChar;
        if(c=='\n') {
          element.sendKeys("" + c);
//          element.sendKeys(Keys.RETURN);
//          sleep(rand.nextInt(500));
//          element = getElement(xpath);
        } else {
          element.sendKeys("" + c);
        }
        if (charByChar > 0) {
          sleep(rand.nextInt(charByChar));
        }
      }
    }
  }

  private static void sleep(int millis) {
    try {
      Thread.sleep(millis);
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }
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
        sleep = 4000;
        connect(xpath);
        break;
      case "writeText":
      case "pasteText":
        var text = ((Map<String, Object>) actionData).get("text").toString();
        var charByChar = (int) (double) ((Map<String, Object>) actionData).getOrDefault("charByChar", 0.0);
        var clearText = (boolean) ((Map<String, Object>) actionData).get("clear");
        if (action.equals("writeText"))
          writeText(xpath, text, charByChar, clearText);
        else
          pasteText(xpath, text, clearText);
        break;
      case "click":
        click(xpath);
        break;
      case "waitForVisibility":
        waitForVisibility(xpath);
        break;
      case "startRecord":
        startRecord(xpath);
        break;
      default:
        throw new RuntimeException("Unsupported action " + action);
    }
    sleep(sleep);
  }
}
