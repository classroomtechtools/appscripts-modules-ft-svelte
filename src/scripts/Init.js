/**
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file
 * access for this add-on. It specifies that this add-on will only
 * attempt to read or modify the files in which the add-on is used,
 * and not all of the user's files. The authorization request message
 * presented to users will reflect this limited scope.
 */

function onOpen (e) {
  SpreadsheetApp.getUi().createAddonMenu()
    .addItem("Show sidebar", "showSidebar")
    .addToUi();
}

function onInstall (e) {
  onOpen(e);
}

function showSidebar() {
  // do not need to use templating with Svelte, it'll all inline
  const html = HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Starter Svelte App');
  SpreadsheetApp.getUi().showSidebar(html);
}
