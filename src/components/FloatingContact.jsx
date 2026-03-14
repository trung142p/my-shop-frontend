import React from 'react';

function FloatingContact() {
    return (
        <div className="fixed right-4 bottom-24 z-50 flex flex-col gap-3">
            {/* Zalo */}
            <a
                href="https://zalo.me/0792131283"
                target="_blank"
                className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                title="Chat Zalo"
            >
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" className="w-8 h-8" alt="Zalo" />
            </a>

            {/* Facebook Messenger */}
            <a
                href="#"
                target="_blank"
                className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                title="Chat Facebook"
            >
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg" className="w-8 h-8" alt="Messenger" />
            </a>

            {/* Gmail */}
            <a
                href="mailto:vohoangphuc112280@gmail.com"
                className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                title="Gửi Email"
            >
                <span className="text-white font-bold text-xl">✉</span>
            </a>
        </div>
    );
}

export default FloatingContact;