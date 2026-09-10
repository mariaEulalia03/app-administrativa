import os

base_dir = "/home/maria/agrosaberes/AgroSaberes_web/templates"
if not os.path.exists(base_dir):
    os.makedirs(base_dir)

# Template constants
colors = {
    'primary': '#2c5630',
    'primary_dark': '#1e3c22',
    'accent': '#daaa2a',
    'earth': '#8B5A2B',
    'clay': '#C07C41',
    'cerulean': '#2A52BE',
    'cream': '#Fdfdf0',
    'white': '#ffffff',
    'text': '#111827',
    'text_muted': '#555555'
}

logos = """
<div style="text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
    <img src="../src/assets/logo.png" alt="AgroSaberes" style="max-height: 80px; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">
    <p style="margin: 0; font-size: 14px; font-weight: bold; color: {primary};">
        Universidad de Cuenca | EDEC EP | Consejo Cantonal de Salud de Cuenca
    </p>
</div>
"""

# HTML structure for versions
def generate_html(category, version):
    if version == 'A':
        style = f"""
        <style>
            body {{ font-family: 'Open Sans', sans-serif; background-color: {colors['cream']}; margin: 0; padding: 20px; color: {colors['text']}; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: {colors['white']}; border-radius: 16px; padding: 30px; box-shadow: 0 4px 15px rgba(44, 86, 48, 0.1); border: 1px solid {colors['primary_dark']}; background-image: url('https://www.transparenttextures.com/patterns/cream-paper.png'); }}
            .header {{ background-color: {colors['primary']}; color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center; }}
            .header h1 {{ color: #ffffff !important; }}
            .btn {{ background-color: {colors['earth']}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; margin-top: 20px; }}
            h1, h2, h3 {{ color: {colors['primary_dark']}; }}
        </style>
        """
    elif version == 'B':
        style = f"""
        <style>
            body {{ font-family: 'Lato', sans-serif; background-color: #f9fafb; margin: 0; padding: 20px; color: {colors['text']}; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: {colors['white']}; padding: 40px; border-top: 4px solid {colors['primary']}; }}
            .header {{ text-align: left; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb; }}
            .btn {{ background-color: {colors['primary']}; color: white; padding: 12px 24px; text-decoration: none; display: inline-block; font-weight: bold; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px; }}
            h1, h2, h3 {{ color: {colors['text']}; font-weight: 300; }}
        </style>
        """
    else: # Version C
        style = f"""
        <style>
            body {{ font-family: 'Inter', sans-serif; background-color: #eef2f6; margin: 0; padding: 20px; color: {colors['text']}; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: {colors['white']}; border-radius: 8px; padding: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); position: relative; overflow: hidden; }}
            .container::before {{ content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, {colors['primary']}, {colors['cerulean']}); }}
            .header {{ text-align: center; padding-bottom: 20px; }}
            .btn {{ background: linear-gradient(135deg, {colors['primary']} 0%, {colors['cerulean']} 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin-top: 20px; box-shadow: 0 4px 10px rgba(42, 82, 190, 0.3); }}
            h1, h2, h3 {{ color: {colors['primary']}; }}
            .data-viz {{ background-color: #f0f4f8; padding: 15px; border-radius: 8px; border-left: 4px solid {colors['cerulean']}; margin: 20px 0; }}
        </style>
        """

    content = ""
    if category == "boletines_mensuales":
        title = "Boletín Mensual - AgroSaberes"
        content = f"""
        <h2>Actualizaciones de la Agenda Agroecológica</h2>
        <p>Descubre las novedades de este mes en nuestra comunidad. Hemos organizado nuevas ferias y eventos de Aprendizaje y Capacitación.</p>
        {'<div class="data-viz"><strong>Progreso del mes:</strong> +15% participación en talleres comunitarios.</div>' if version == 'C' else ''}
        <div style="text-align: center; margin-top: 25px;">
            <a href="https://telemedicina.ucuenca.edu.ec/agrosaberes" class="btn">Leer el boletín completo</a>
        </div>
        """
    elif category == "onboarding":
        title = "¡Bienvenido a AgroSaberes!"
        content = f"""
        <h2>Tu plataforma de conexión con el mercado agroecológico local</h2>
        <p>Estamos emocionados de tenerte aquí. Conoce las funcionalidades clave, incluyendo nuestro Agente Inteligente, diseñado para facilitar tu experiencia y aprendizaje.</p>
        {'<div class="data-viz"><strong>Paso 1:</strong> Completa tu perfil para acceder a todas las funciones.</div>' if version == 'C' else ''}
        <div style="text-align: center; margin-top: 25px;">
            <a href="https://telemedicina.ucuenca.edu.ec/agrosaberes" class="btn">Explorar la plataforma</a>
        </div>
        """
    elif category == "eventos":
        title = "Invitación a Próximos Talleres y Eventos"
        content = f"""
        <h2>Seminarios y Reuniones Comunitarias</h2>
        <p>Únete a nuestras próximas capacitaciones enfocadas en prácticas agrícolas sostenibles y desarrollo comunitario. Consulta los detalles a continuación.</p>
        <p><strong>Fecha:</strong> Próximo Sábado<br><strong>Lugar:</strong> Centro de Convenciones EDEC</p>
        <div style="text-align: center; margin-top: 25px;">
            <a href="https://telemedicina.ucuenca.edu.ec/agrosaberes" class="btn">Registrarse ahora</a>
        </div>
        """
    elif category == "actualizaciones":
        title = "Nuevas Funcionalidades del Proyecto"
        content = f"""
        <h2>Nuevos hitos en AgroSaberes</h2>
        <p>Hemos añadido nuevas herramientas a la plataforma SISA para visibilizar mejor a nuestros productores agroecológicos. Descubre los nuevos perfiles y el mapa interactivo.</p>
        <div style="text-align: center; margin-top: 25px;">
            <a href="https://telemedicina.ucuenca.edu.ec/agrosaberes/proyecto/" class="btn">Ver actualizaciones</a>
        </div>
        """

    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    {style}
</head>
<body>
    <div class="container">
        {logos.format(primary=colors['primary'])}
        <div class="header">
            <h1 style="margin:0;">{title}</h1>
        </div>
        <div class="content">
            {content}
        </div>
        <div style="margin-top: 40px; font-size: 12px; color: {colors['text_muted']}; text-align: center;">
            <p>&copy; 2024 Proyecto AgroSaberes. Todos los derechos reservados.</p>
            <p>Universidad de Cuenca | EDEC EP | Consejo Cantonal de Salud</p>
        </div>
    </div>
</body>
</html>"""
    return html

categories = ['boletines_mensuales', 'onboarding', 'eventos', 'actualizaciones']
versions = ['A', 'B', 'C']

for cat in categories:
    for ver in versions:
        filename = f"{cat}_version_{ver}.html"
        filepath = os.path.join(base_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(generate_html(cat, ver))

print("Templates updated successfully.")
