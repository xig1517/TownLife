import chatSendBefore from "./chatSendBefore";
import playerBreakBefore from "./playerBreakBefore";

abstract class Building_EventHandler {
    static readonly chatSendBefore = chatSendBefore;
    static readonly playerBreakBefore = playerBreakBefore
}
export default Building_EventHandler;