package com.hipotecalab.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Base64;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.OutputStream;

@CapacitorPlugin(name = "FileExport")
public class FileExportPlugin extends Plugin {
    @PluginMethod
    public void save(PluginCall call) {
        String filename = call.getString("filename");
        String mimeType = call.getString("mimeType");
        if (filename == null || mimeType == null || call.getString("data") == null) {
            call.reject("Faltan los datos del archivo.");
            return;
        }
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType(mimeType);
        intent.putExtra(Intent.EXTRA_TITLE, filename);
        try {
            startActivityForResult(call, intent, "documentCreated");
        } catch (Exception error) {
            call.reject("No se pudo abrir el selector de archivos.", error);
        }
    }

    @ActivityCallback
    private void documentCreated(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() == Activity.RESULT_CANCELED) {
            call.resolve(new JSObject().put("cancelled", true));
            return;
        }
        Uri uri = result.getData() == null ? null : result.getData().getData();
        if (result.getResultCode() != Activity.RESULT_OK || uri == null) {
            call.reject("No se ha recibido una ubicación para guardar.");
            return;
        }
        // Writing can involve a cloud document provider; keep it off the UI thread.
        getBridge().execute(() -> {
            try (OutputStream output = getContext().getContentResolver().openOutputStream(uri, "w")) {
                if (output == null) throw new java.io.IOException("No se pudo abrir el archivo.");
                output.write(Base64.decode(call.getString("data", ""), Base64.DEFAULT));
                output.flush();
            } catch (Exception error) {
                call.reject("No se pudo guardar el archivo. Prueba otra ubicación.", error);
                return;
            }
            call.resolve(new JSObject().put("cancelled", false));
        });
    }
}
