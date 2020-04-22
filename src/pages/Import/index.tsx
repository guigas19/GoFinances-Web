import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    async function apiProccesFile(): Promise<void> {
      await Promise.all(
        uploadedFiles.map(async uploadedFile => {
          data.append('file', uploadedFile.file);
          try {
            await api.post('/transactions/import', data);
            history.push('/');
          } catch (err) {
            console.log(err.response.error);
          }

          data.delete('file');
        }),
      );
    }

    await apiProccesFile();

    history.push('/');
  }

  function submitFile(files: File[]): void {
    files.map(file => {
      const newFile: FileProps = {
        file,
        name: file.name,
        readableSize: file.size.toString(),
      };

      setUploadedFiles([...uploadedFiles, newFile]);
      return 1;
    });
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
