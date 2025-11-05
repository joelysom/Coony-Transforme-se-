### TELA DE MANUTENÇÃO - DESKTOP E MOBILE
"""
Tela_Manutencao.py
Recriação visual (falsa) da tela mostrada usando Tkinter + Pillow.
Requer: pip install pillow
Execute: python login_tela.py
"""

import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageDraw, ImageFilter, ImageTk, ImageFont
import os
import sys

# --- Configurações visuais ---
WIN_W, WIN_H = 1024, 768
CARD_W, CARD_H = 860, 380  # tamanho do cartão central aumentado
CARD_RADIUS = 16
SHADOW_OFFSET = (0, 8)
ORANGE = (232, 127, 60)  # aproximado do laranja da imagem
OFF_BG = (242, 245, 246)  # fundo geral
DARK_TEXT = (33, 43, 54)  # texto mais escuro para melhor contraste
WHITE = (255, 255, 255)

# Tentar carregar fonte Poppins se disponível, caso contrário fallback
def load_font(path_list, size):
    for p in path_list:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()

# caminhos de fontes comuns (pode não existir em todos sistemas)
font_paths = [
    "/usr/share/fonts/truetype/poppins/Poppins-Bold.ttf",
    "/usr/share/fonts/truetype/poppins/Poppins-Regular.ttf",
    "C:\\Windows\\Fonts\\Poppins-Bold.ttf",
    "C:\\Windows\\Fonts\\Poppins-Regular.ttf",
]

# --- Funções para desenhar cartão com sombra e triângulo diagonal ---
def rounded_rectangle(draw, xy, r, fill):
    # xy = (x1, y1, x2, y2)
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=r, fill=fill)

def create_card_image(w=CARD_W, h=CARD_H, radius=CARD_RADIUS, bg=(255,255,255), orange=ORANGE):
    # cria imagem com sombra e o cartão dividido diagonalmente (branco + laranja)
    # imagem final com sombra incluída
    pad = 30
    img_w, img_h = w + pad*2, h + pad*2
    base = Image.new("RGBA", (img_w, img_h), (0,0,0,0))

    # sombra (desenhar retângulo escuro, aplicar blur)
    shadow = Image.new("RGBA", (w, h), (0,0,0,0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((0,0,w,h), radius=radius, fill=(0,0,0,200))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    base.paste(shadow, (pad+SHADOW_OFFSET[0], pad+SHADOW_OFFSET[1]), shadow)

    # cartão base branco
    card = Image.new("RGBA", (w, h), (0,0,0,0))
    dc = ImageDraw.Draw(card)
    dc.rounded_rectangle((0,0,w,h), radius=radius, fill=bg)

    # desenhar triângulo laranja à direita, alinhado em diagonal:
    # Monte uma máscara: forma do triângulo recortando a porção direita
    tri = Image.new("RGBA", (w, h), (0,0,0,0))
    dt = ImageDraw.Draw(tri)
    # pontos do polígono para triângulo diagonal semelhante ao exemplo
    dt.polygon([(w*0.55, 0), (w, 0), (w, h*0.85), (w*0.75, h), (w*0.6, h)], fill=orange)
    card = Image.alpha_composite(card, tri)

    base.paste(card, (pad, pad), card)
    return base

# --- Construção da GUI usando Tkinter ---
class LoginApp:
    def __init__(self, root):
        self.root = root
        root.title("Login - Tela de Exemplo")
        root.geometry(f"{WIN_W}x{WIN_H}")
        root.configure(bg=self._rgb_to_hex(OFF_BG))
        root.resizable(False, False)

        # Canvas principal para posicionar elementos livres
        self.canvas = tk.Canvas(root, width=WIN_W, height=WIN_H, bg=self._rgb_to_hex(OFF_BG), highlightthickness=0)
        self.canvas.pack(fill="both", expand=True)

        # Logo (textual aproximado)
        self._draw_logo()

        # cartão central (imagem gerada)
        self.card_img = create_card_image()
        self.card_photo = ImageTk.PhotoImage(self.card_img)
        card_x = (WIN_W//2) - (CARD_W//2)
        card_y = 150
        self.canvas.create_image(card_x, card_y, anchor="nw", image=self.card_photo, tags="card")

        # Sobrepor textos e campos por cima do cartão (usando widgets Tkinter posicionados sobre o canvas)
        # Calcular referências
        card_inner_x = card_x + 40
        card_inner_y = card_y + 35

        # Título "ENTRAR" (lado esquerdo)
        title_x = card_inner_x + 20
        title_y = card_inner_y + 8
        self.canvas.create_text(title_x, title_y, anchor="nw", text="ENTRAR", font=("Helvetica", 28, "bold"), fill=self._rgb_to_hex(DARK_TEXT))

        # sublinha laranja
        self.canvas.create_line(title_x, title_y+50, title_x+140, title_y+50, width=4, fill=self._rgb_to_hex(ORANGE))

        # Texto de boas-vindas abaixo do título
        welcome_text = "Digite suas credenciais para acessar o sistema"
        self.canvas.create_text(title_x, title_y+70, anchor="nw", text=welcome_text, font=("Helvetica", 11), fill=self._rgb_to_hex(DARK_TEXT))

        # labels de campos e entradas - usaremos frames/entries sobre o canvas
        # Usuario
        entry_x = title_x
        entry_y = title_y + 100
        icon_user = "👤"  # ícone simples
        
        # Label "Usuário"
        self.canvas.create_text(entry_x, entry_y-20, anchor="w", text="Usuário", font=("Helvetica", 11), fill=self._rgb_to_hex(DARK_TEXT))
        self.canvas.create_text(entry_x + 290, entry_y+8, anchor="w", text=icon_user, font=("Helvetica", 12), fill=self._rgb_to_hex(DARK_TEXT))

        self.user_var = tk.StringVar()
        self.user_entry = tk.Entry(self.root, bd=0, textvariable=self.user_var, font=("Helvetica", 12))
        # posicionar sobre canvas (place)
        self.user_entry.place(x=entry_x, y=entry_y, width=320, height=30)

        # linha inferior (underline) laranja
        self.canvas.create_line(entry_x, entry_y+34, entry_x+320, entry_y+34, width=1.5, fill=self._rgb_to_hex(ORANGE))

        # Senha
        entry2_y = entry_y + 70
        icon_lock = "🔒"
        
        # Label "Senha"
        self.canvas.create_text(entry_x, entry2_y-20, anchor="w", text="Senha", font=("Helvetica", 11), fill=self._rgb_to_hex(DARK_TEXT))
        self.canvas.create_text(entry_x + 290, entry2_y+8, anchor="w", text=icon_lock, font=("Helvetica", 12), fill=self._rgb_to_hex(DARK_TEXT))

        self.pass_var = tk.StringVar()
        self.pass_entry = tk.Entry(self.root, bd=0, textvariable=self.pass_var, font=("Helvetica", 12), show="*")
        self.pass_entry.place(x=entry_x, y=entry2_y, width=320, height=30)
        self.canvas.create_line(entry_x, entry2_y+34, entry_x+320, entry2_y+34, width=1.5, fill=self._rgb_to_hex(ORANGE))

        # Botão "Entrar" arredondado (usando imagem)
        btn_img = self._create_round_button_image(180, 45, "Entrar")
        self.btn_photo = ImageTk.PhotoImage(btn_img)
        btn_x = entry_x + 70
        btn_y = entry2_y + 65
        self.login_btn = tk.Button(self.root, image=self.btn_photo, bd=0, command=self.on_login)
        self.login_btn.place(x=btn_x, y=btn_y, width=180, height=45)

        # links de texto (esqueci a senha / primeiro acesso)
        self.canvas.create_text(entry_x + 40, btn_y + 65, anchor="nw", text="Esqueceu a senha?", font=("Helvetica", 10), fill=self._rgb_to_hex(ORANGE))
        self.canvas.create_text(entry_x + 190, btn_y + 65, anchor="nw", text="Primeiro acesso?", font=("Helvetica", 10), fill=self._rgb_to_hex(ORANGE))

        # Lado direito grande texto "Bem Vindo(a) De volta!"
        big_x = card_x + CARD_W - 360
        big_y = card_y + 40
        welcome_text = "Bem Vindo(a)\nDe volta!"
        self.canvas.create_text(big_x, big_y, anchor="nw", text=welcome_text, font=("Helvetica", 38, "bold"), fill="white", justify="left")

        # descrição menor
        desc = "Que bom ter você de volta!\nInsira seus dados cadastrados\npara acessar o sistema."
        self.canvas.create_text(big_x, big_y+130, anchor="nw", text=desc, font=("Helvetica", 13), fill="white", justify="left")

    def _create_round_button_image(self, w, h, text):
        # cria imagem arredondada com sombra para botão
        img = Image.new("RGBA", (w, h), (0,0,0,0))
        draw = ImageDraw.Draw(img)
        # sombra
        sh = Image.new("RGBA", (w, h), (0,0,0,0))
        sd = ImageDraw.Draw(sh)
        sd.rounded_rectangle((4,4,w-4,h-4), radius=h//2, fill=(0,0,0,80))
        sh = sh.filter(ImageFilter.GaussianBlur(3))
        img = Image.alpha_composite(img, sh)
        # botão
        btn = Image.new("RGBA", (w, h), (0,0,0,0))
        db = ImageDraw.Draw(btn)
        db.rounded_rectangle((0,0,w,h), radius=h//2, fill=ORANGE)
        # texto
        font = load_font(font_paths, 14)
        # Get text bbox instead of size
        bbox = db.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        # Center the text
        text_x = (w - text_w) / 2
        text_y = (h - text_h) / 2 - 1
        db.text((text_x, text_y), text, font=font, fill=(255,255,255))
        img = Image.alpha_composite(img, btn)
        return img

    def _draw_logo(self):
        try:
            # Load the PNG logo from the specified path
            logo_path = "img/Logo.png"
            if os.path.exists(logo_path):
                # Open and convert the image
                logo_img = Image.open(logo_path)
                # Convert to RGBA if necessary
                if logo_img.mode != 'RGBA':
                    logo_img = logo_img.convert('RGBA')
                # Resize while maintaining aspect ratio
                logo_width = 155
                aspect_ratio = logo_img.width / logo_img.height
                logo_height = int(logo_width / aspect_ratio)
                logo_img = logo_img.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
                # Convert to PhotoImage for Tkinter
                self.logo_photo = ImageTk.PhotoImage(logo_img)
                # Position the logo
                logo_x = WIN_W//2
                logo_y = 56
                self.canvas.create_image(logo_x, logo_y, image=self.logo_photo, anchor="n")
            else:
                print(f"Logo file not found at: {logo_path}")
                print("Make sure Logo.png exists in the img folder")
        except Exception as e:
            print(f"Error loading logo: {e}")
            print("Current working directory:", os.getcwd())

    def on_login(self):
        # ação do botão (fake)
        u = self.user_var.get().strip()
        if not u:
            messagebox.showinfo("Entrar", "Campo usuário vazio (login simulado).")
        else:
            messagebox.showinfo("Entrar", f"Bem vindo(a), {u}! (login simulado)")

    def _rgb_to_hex(self, rgb):
        return "#%02x%02x%02x" % rgb

def main():
    root = tk.Tk()
    app = LoginApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
