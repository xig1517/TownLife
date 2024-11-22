import chatSendBefore from "./chatSendBefore";

abstract class EventHandler {
    static readonly chatSendBefore = chatSendBefore;
}
export default EventHandler;