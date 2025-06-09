import face_recognition
import cv2
import requests
import os

path = "C:/Users/Tana Alvier/Desktop/Gestão de Dados/Dashboard/Pro/HHR/AVD/Server/media/rostos/"
encodings = []
nomes = []

for arquivo in os.listdir(path):
    imagem = face_recognition.load_image_file(path + arquivo)
    encoding = face_recognition.face_encodings(imagem)[0]
    encodings.append(encoding)
    nomes.append(arquivo.split("_")[0])  
if encoding > 0:
    print("Carregamento de imagens concluído.")
else:
    print("Nenhuma imagem encontrada.")
cam = cv2.VideoCapture(0)

while True:
    ret, frame = cam.read()
    rgb = frame[:, :, ::-1]
    faces = face_recognition.face_locations(rgb)
    faces_enc = face_recognition.face_encodings(rgb, faces)

    for enc in faces_enc:
        matches = face_recognition.compare_faces(encodings, enc)
        if True in matches:
            idx = matches.index(True)
            nome = nomes[idx]
            print("Reconhecido:", nome)
            
            requests.post("http://localhost:8000/api/registrar-ponto/", json={"nome": nome})
    
    cv2.imshow("Reconhecimento", frame)
    if cv2.waitKey(1) == 27:
        break
