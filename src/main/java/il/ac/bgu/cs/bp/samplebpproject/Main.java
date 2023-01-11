package il.ac.bgu.cs.bp.samplebpproject;

import il.ac.bgu.cs.bp.bpjs.analysis.DfsBProgramVerifier;
import il.ac.bgu.cs.bp.bpjs.analysis.listeners.PrintDfsVerifierListener;
import il.ac.bgu.cs.bp.bpjs.context.ContextBProgram;
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.PrintBProgramRunnerListener;
import il.ac.bgu.cs.bp.bpjs.model.*;
import il.ac.bgu.cs.bp.bpjs.model.eventselection.PrioritizedBSyncEventSelectionStrategy;

import java.io.IOException;
import java.text.MessageFormat;

public class Main {
  private BProgram bprog;

  public static void main(String[] args) {
    var main = new Main();
    System.out.println("// start");

    main.createBProgam();
    main.runProgram();
//    main.verifyProgram();
//    main.mapSpace();

    System.out.println("// done");
  }

  private void createBProgam() {
    this.bprog = new ContextBProgram("data/data.js", "js/EventDef.js", "js/NLP.dal.js", "js/NLP.story.js");
//     bprog.setEventSelectionStrategy(new PrioritizedBSyncEventSelectionStrategy());
  }

  private void verifyProgram() throws IOException {
    var vfr = new DfsBProgramVerifier();
    vfr.setMaxTraceLength(2000);
    vfr.setProgressListener(new PrintDfsVerifierListener());
    vfr.setIterationCountGap(100);
//    vfr.setDebugMode(true);
    try {
      var res = vfr.verify(bprog);
      System.out.println(MessageFormat.format(
        "States = {0}\n" +
          "Edges = {1}\n" +
          "Time = {2}",
        res.getScannedStatesCount(), res.getScannedEdgesCount(), res.getTimeMillies()));
      if (res.isViolationFound())
        System.out.println(MessageFormat.format("Found violation: {0}", res.getViolation().get()));
      else
        System.out.println("No violation found");
    } catch (Exception e) {
      e.printStackTrace();
      System.exit(1);
    }
  }

  private void runProgram() {
    var rnr = new BProgramRunner(bprog);
    rnr.addListener(new PrintBProgramRunnerListener());
    rnr.addListener(new SeleniumActuator());
    rnr.run();
  }
}
