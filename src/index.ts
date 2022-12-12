
VSS.init({ usePlatformScripts: true, explicitNotifyLoaded: true });

import witClient = require("TFS/WorkItemTracking/RestClient");
import { urlHelper } from "VSS/Locations";

let client = witClient.getClient();
// client.getWorkItem()

import Clipboard = require("VSS/Utils/Clipboard");
import { htmlEncode } from "VSS/Utils/String";
import { Uri } from "VSS/Utils/Url";



var extensionCtx = VSS.getExtensionContext();

VSS.register(extensionCtx.publisherId + "." + extensionCtx.extensionId + ".contextMenu", {
    execute: (actionContext) => {
        let workItemId = actionContext.id
            || actionContext.workItemId
            || (actionContext.ids && actionContext.ids.length > 0 && actionContext.ids[0])
            || (actionContext.workItemIds && actionContext.workItemIds.length > 0 && actionContext.workItemIds[0]);

        if (workItemId) {




            //alert(workItemId);

            client.getWorkItem(workItemId).then(function (workItem) {

                if (workItem) {

                    let name = workItem.fields["System.Title"];
                    let branch = "AB#" + workItemId + "-" + name.replace(/ /g, '_').replace(/[^a-z0-9_]/gi, '');

                    Clipboard.copyToClipboard(branch, <Clipboard.IClipboardOptions>{
                        copyAsHtml: false,
                        showCopyDialog:true
                    });

                    console.log(branch);
                    //alert(branch);

                  
                    VSS.getService<IHostDialogService>(VSS.ServiceIds.Dialog).then(function(dialogService) {
                        var extensionCtx = VSS.getExtensionContext();
                        // Build absolute contribution ID for dialogContent
                        var contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".branching-form";
                
                        // Show dialog
                        var dialogOptions = {
                            title: "Workitem Branch Name",
                            width: 400,
                            height: 300,
                            buttons: null,
                            urlReplacementObject: { branch: encodeURIComponent( branch) }
                        };
                
                        dialogService.openDialog(contributionId, dialogOptions);
                    });




                }

            });

            // var text = "Example text to appear on clipboard";

        }
    }
});


