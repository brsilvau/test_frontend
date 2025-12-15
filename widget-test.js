/**
 * Archivo: widget-test.js
 * Propósito: Script estático para probar la lectura de JWT (Query Param) y
 * Customer ID/System Key (Cookies) en un entorno cross-domain.
 *
 * NOTA: Este script DEBE estar referenciado por la etiqueta <script> con
 * id="planok-notes-widget" en el HTML de tu PHP.
 */

(function() {
    // ----------------------------------------------------------------------
    // 1. FUNCIONES DE UTILIDAD PARA LA LECTURA DE DATOS
    // ----------------------------------------------------------------------

    /**
     * Lee el valor de una cookie por su nombre.
     */
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        // Si hay dos partes, la segunda contiene el valor y lo que le siga.
        if (parts.length === 2) return parts.pop().split(';').shift() ?? null;
        return null;
    }

    /**
     * Lee un parámetro de la URL del script que lo cargó, asumiendo el ID fijo.
     */
    function getQueryParamFromScript(scriptId, param) {
        const script = document.getElementById(scriptId);
        if (!script || !(script instanceof HTMLScriptElement)) return null;
        
        try {
            const url = new URL(script.src);
            return url.searchParams.get(param);
        } catch (e) {
            console.error("Widget Test: Error al parsear la URL del script.", e);
            return null;
        }
    }

    // ----------------------------------------------------------------------
    // 2. FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
    // ----------------------------------------------------------------------

    function initializeTestWidget() {
        const scriptId = 'planok-notes-widget';
        const scriptElement = document.getElementById(scriptId);

        if (!scriptElement) {
            console.error("Widget Test: No se encontró la etiqueta <script> con id:", scriptId);
            return;
        }

        // Leer los datos
        const accessToken = getQueryParamFromScript(scriptId, 'jwt'); // De Query Param (src)
        const customerId = getCookie('CLID');             // De Cookie
        const systemKey = getCookie('TEST_SYSTEM_KEY');               // De Cookie
        
        const containerId = scriptElement.getAttribute('data-container-id');
        const container = document.getElementById(containerId || 'test-componente-container');

        if (!container) {
            console.error(`Widget Test: No se encontró el contenedor con ID: ${containerId}`);
            return;
        }

        let htmlContent = '<h3>Resultados de la Prueba de Lectura (desde script externo):</h3>';
        let success = true;

        if (accessToken && customerId && systemKey) {
            htmlContent += '<p style="color: green; font-weight: bold;">✅ ÉXITO: Todos los datos fueron leídos.</p>';
        } else {
            htmlContent += '<p style="color: red; font-weight: bold;">❌ FALLO: Faltan datos.</p>';
            success = false;
        }

        htmlContent += '<ul>';
        htmlContent += `<li><strong>JWT (Query Param):</strong> ${accessToken ? 'Leído (' + accessToken.substring(0, 10) + '...)' : '❌ NO LEÍDO'}</li>`;
        htmlContent += `<li><strong>Customer ID (Cookie):</strong> ${customerId ? 'Leído (' + customerId + ')' : '❌ NO LEÍDO'}</li>`;
        htmlContent += `<li><strong>System Key (Cookie):</strong> ${systemKey ? 'Leído (' + systemKey + ')' : '❌ NO LEÍDO'}</li>`;
        htmlContent += '</ul>';

        // 3. Inyectar el resultado en el contenedor
        container.innerHTML = htmlContent;
        
        if (success) {
             // Aquí iría la lógica para hacer la llamada API autenticada y renderizar la interfaz real.
             console.log("Test Widget OK: Datos recibidos y listo para iniciar la aplicación real.");
        }
    }

    // ----------------------------------------------------------------------
    // 3. EJECUCIÓN (Asegurar que el DOM esté listo)
    // ----------------------------------------------------------------------
    
    // Espera a que el DOM esté completamente cargado antes de intentar leer
    // el <script> y el <div> contenedor.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTestWidget);
    } else {
        initializeTestWidget();
    }
})();
