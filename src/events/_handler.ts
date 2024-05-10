import chatSendBefore from "./chatSendBefore";
import playerBreakBefore from "./playerBreakBefore";

abstract class EventHandler {
    static readonly chatSendBefore = chatSendBefore;
    static readonly playerBreakBefore = playerBreakBefore;
}
export default EventHandler;