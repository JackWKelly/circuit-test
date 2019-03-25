module.exports = class ConversationContext {

    handleMessage(input) {
        throw Error("handleMessage method not implemented");
    }

    isConversationEnded() {
        throw Error("isConversationEnded method not implemented")
    }
}