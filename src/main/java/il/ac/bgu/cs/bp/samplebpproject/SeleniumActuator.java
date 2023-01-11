package il.ac.bgu.cs.bp.samplebpproject;

import il.ac.bgu.cs.bp.bpjs.execution.listeners.BProgramRunnerListenerAdapter;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;

import java.util.Map;

public class SeleniumActuator extends BProgramRunnerListenerAdapter {
  @Override
  public void eventSelected(BProgram bp, BEvent e) {
    if (!e.name.equals("Selenium")) return;
    var data = (Map<String, Object>) e.maybeData;
    var action = (String) data.get("type");
    var xpath = (String) data.get("xpath");
    var actionData = data.get("data");
    switch (action) {
      case "startSession":
        break;
      default:
        throw new RuntimeException("Unsupported action");
    }
  }
}
